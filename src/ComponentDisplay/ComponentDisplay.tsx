import React, { useState, useEffect } from "react";
import { AdvancedFilter } from "../Filter/AdvancedFilter";
import { componentService } from "../_services/componentService";
import { LinearLoading } from "../_components/LinearLoading";
import { fsiService } from "../_services/fsiService";
import { versionService } from "../_services/versionService";
import { tableService } from "../_services/tableService";
import { caseService } from "../_services/caseService";
import { ComponentType } from "./componentType";
import { dataService } from "../_services/dataService";
import { useStore } from "../_context/Store";
import { noteService } from "../_services/noteService";
import { isChart } from "../Chart/IFilteredChart";
import { getNoteLinkFromDataSource, LinkTypeKey } from "../Notes/NoteUtils";
import { treeService } from "../_services/treeService";
import { NoteType } from "../Notes/Note";
import { NoteLinkType } from "../Model/iTechRestApi/NoteLinkType";
import { useStyles } from "./Component.styles";
import { ComponentTabs } from "./ComponentNavBar";
import CaseProperties from "../Properties/CaseProperties";
import IDVerification from "../IDVerification/IDVerification";
import Actions from "../Actions/Actions";
import CaseUsers from "../CaseUsers/CaseUsers";
import tableConfigFactory from "../VirtualTable/TableConfig/TableConfigFactory";
import Hierarchy from "../VirtualTable/Hierarchy/Hierarchy";
import CaseNotes from "../Notes/CaseNotes";
import Versions from "../Versions/Versions";
import NoteList from "../Notes/NoteList";
import ObjectAudit from "../Preview/ObjectAudit";
import ChartWizard from "../Chart/ChartWizard";
import ChangeComponentWizard from "./ChangeComponentWizard";
import Counter from "../Counter/Counter";
import Preview from "../Preview/Preview";
import Properties from "../Properties/Properties";
import Wizard from "./Wizard";
import VirtualTable from "../VirtualTable/VirtualTable";
import { TreeDisplay } from "../Tree/TreeDisplay";
import { getInvestigationId } from "../_helpers/helpers";
import { isFilterGroupColor } from "../_helpers/utilities";
import { refreshDropdownListsSeconds, refreshDropdownLists } from "../Model/Types/RefreshInterval";
import CollectionTotalGrid from "../VirtualTable/CollectionTotalGrid";
import AssureReport from "../Reports/AssureReport";
import { assureService } from "../_services/assureService";

interface IComponentDisplayProps {
  component: any;
  dataIsSet(rowId: number, data: any): void;
}

const ComponentDisplay: React.FC<IComponentDisplayProps> = ({ component, dataIsSet }) => {
  const classes = useStyles();
  const [data, setData] = useState(component.data);
  const [refresh, setRefresh] = useState(false);
  const { selectors } = useStore();

  useEffect(() => {
    setData(component.data);
  }, [component.data, setData]);

  useEffect(() => {
    if (refresh) {
      // reset flag to re-render the actual component
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    // '' is a valid value...
    if (component.data?.refreshInterval !== undefined) {
      // set a refresh seconds
      const index = refreshDropdownLists.indexOf(component.data?.refreshInterval);
      const seconds = refreshDropdownListsSeconds[index];
      const interval = setInterval(() => {
        setRefresh(true);
      }, seconds);
      // cleanup
      return () => {
        clearTimeout(interval);
      };
    }
  }, [refresh]);

  const updateData = (data: any) => {
    const comp = component;
    comp.data = data;
    comp.json = JSON.stringify(data);
    componentService.json(comp.rowId, data).then(() => {
      setData(data);
      dataIsSet(comp.rowId, data);
    });
  };

  const updateVirtualTable = ({ ...tableParams }) => {
    const data = { ...component.data, ...tableParams };
    delete data.columns;
    data.subItems = tableParams.columns;
    componentService.json(component.rowId, data).then(() => dataIsSet(component.rowId, data));
  };

  const isCurrentFilterGroupColor = isFilterGroupColor(selectors.getSelectedGridRow(), data);

  if (refresh) return null;

  return (
    <>
      {/* <ComponentNavBar data={data} updateData={updateData} /> */}
      <ComponentTabs data={data} updateData={updateData} />

      {!data || data.componentType === ComponentType.Wizard ? (
        <Wizard config={data} updateData={updateData} area={component.area} />
        ) : data.componentType === ComponentType.CollectionTotalGrid ? (
          <CollectionTotalGrid
          />
      ) : data.componentType === ComponentType.VirtualTable ? (
        <VirtualTable
          setup={data}
          configUpdate={updateVirtualTable}
          updateData={updateData}
          area={component.area}
          //tableConfig={{ hideActionMenu: selectors.getCaseClosed() }}
          config={tableConfigFactory(data.name)}
        />
      ) : data.componentType === ComponentType.TreeFilter ? (
        <TreeDisplay config={data} area={component.area} service={treeService} />
      ) : data.componentType === ComponentType.AdvancedFilter ? (
        <AdvancedFilter
          data={data}
          area={component.area}
          tabId={component.iTechDataWebTabRowId}
          updateData={updateData}
          dataService={dataService}
        />
      ) : data.componentType === ComponentType.Preview ? (
        <Preview
          data={data}
          area={component.area}
          fsiService={fsiService}
          dataService={dataService}
          disableRedaction={data.hideNav}
        />
      ) : data.componentType === ComponentType.Properties ? (
        <Properties data={data} tableService={tableService} area={component.area} />
      ) : data.componentType === ComponentType.Versions ? (
        <Versions
          data={data}
          versionService={versionService}
          fsiService={fsiService}
          area={component.area}
        />
      ) : data.componentType === ComponentType.Counter ? (  
        <Counter data={data} service={dataService} area={component.area} updateData={updateData} />
      ) : data.componentType === ComponentType.CaseUsers ? (
        <CaseUsers data={data} area={component.area} />
      ) : data.componentType === ComponentType.CaseNotes ? (
        <CaseNotes
          caseId={selectors.getSelectedCaseId()}
          service={noteService}
          area={component.area}
          dataService={dataService}
        />
      ) : data.componentType === ComponentType.TabNotes ? (
        <NoteList
          service={noteService}
          area={component.area}
          noteType={(data?.data?.noteType as NoteType) ?? NoteType.Normal}
          linkType={NoteLinkType.tab}
          linkId={selectors.getSelectedTabId()}
        />
      ) : data.componentType === ComponentType.NoteList ? (
        <NoteList
          linkType={getNoteLinkFromDataSource(
            selectors.getSelectedGridRow()?.datasource as LinkTypeKey,
            selectors.getSelectedGridRow()?.gid
          )}
          linkId={isCurrentFilterGroupColor ? selectors.getSelectedGridRow()?.rowId : undefined}
          service={noteService}
          area={component.area}
          noteType={data?.noteType ?? NoteType.Normal}
          offset={48}
        />
      ) : data.componentType === ComponentType.Hierarchy ? (
        <Hierarchy
          area={component.area}
          configUpdate={updateVirtualTable}
          updateData={updateData}
          data={data}
        />
      ) : isChart(data.componentType) ? (
        <span className={classes.fontFix}>
          <ChartWizard
            componentType={data.componentType}
            data={data}
            updateData={updateData}
            area={component.area}
            tableService={tableService}
          />
        </span>
      ) : data.componentType === ComponentType.ChangeComponent ? (
        <ChangeComponentWizard
          componentType={data.componentType}
          data={data}
          updateData={updateData}
          area={component.area}
        />
      ) : data.componentType === ComponentType.ObjectAudit ? (
        <div className={classes.component}>
          <ObjectAudit
            rowId={isCurrentFilterGroupColor ? selectors.getSelectedGridRow()?.rowId : undefined}
            area={component.area}
            configUpdate={updateVirtualTable}
            updateData={updateData}
            data={data}
          />
        </div>
      ) : data.componentType === ComponentType.IDVerification ? (
        <IDVerification
          caseId={selectors.getSelectedCaseId()}
          investigationId={getInvestigationId()}
          service={caseService}
          area={component.area}
        />
      ) : data.componentType === ComponentType.Actions ? (
        <Actions area={component.area} />
      ) : data.componentType === ComponentType.CaseProperties ? (
        <CaseProperties
          caseId={selectors.getSelectedCaseId()}
          dataService={dataService}
          area={component.area}
        />
      ) : data.componentType === ComponentType.AssureReport ? (
        <AssureReport
          service={assureService}
          area={component.area}
          updateData={updateData}
          data={data}
        />
      ) : (
        <div>component display: {JSON.stringify(data)}</div>
      )}
      <LinearLoading width={{ width: "100%" }} area={component.area} />
    </>
  );
};

export default ComponentDisplay;
