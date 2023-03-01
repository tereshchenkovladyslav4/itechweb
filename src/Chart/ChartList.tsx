import Button from "@mui/material/Button";
import React from "react";
import { Box, List, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import IconManager from "../_components/IconManager";
import { ListButton } from "../ComponentDisplay/ListButton";
import { WIZARD_STATE } from "../_components/wizardState";
import {
  ChartDataSources,
  ChartNameIndex,
  Charts,
  getNameByIndex,
  getVirtualTable,
} from "./IFilteredChart";
import { ComponentType } from "../ComponentDisplay/componentType";
import { ITechControlTable } from "../Model/iTechRestApi/ITechControlTable";
import { Immutable } from "../_context/selectors/useSelectors";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  display: {
    margin: "4vh",
  },
}));

interface IUpdate {
  name: string | null;
  data: any;
  config: any;
  state: any;
}

interface IChartWizardListProps {
  data: any;
  updateData(data: any): void;
  isFiltered: boolean;
  caseId?: number;
  dataSourceList: ReadonlyArray<Immutable<ITechControlTable>>;
}

const ChartList: React.FC<IChartWizardListProps> = ({
  data,
  updateData,
  isFiltered,
  caseId,
  dataSourceList,
}) => {
  const classes = useStyles();

  const _updateComponent = ({ name: wizardType, data, config, state }: IUpdate) => {
    const componentType = !config ? wizardType : ComponentType.Wizard;
    let subData = data?.data || data;

    // call & get the columnn data for subdata if not present
    if (!subData?.subItems) {
      // TODO: check if iTechWebCaseManagement always present as datasource
      const dataSource = wizardType
        ? ChartDataSources[Charts.indexOf(wizardType)]
        : caseId
        ? "iTechWebCaseManagement"
        : "";

      if (dataSource) {
        const virtualTableData = getVirtualTable(dataSource, dataSourceList);
        subData = virtualTableData;
      }
    }
    updateData({
      componentType: componentType,
      wizardType: wizardType,
      wizardState: state,
      data: subData,
    });
  };

  const filterData = data?.data || data;
  // match to filter name i.e. datasource
  const isEnabled = (index: ChartNameIndex, hasCaseVersion: boolean): boolean => {
    const dataSourceEnabled =
      ChartDataSources[index] === "" ||
      dataSourceList?.some((ds) => ds.name === ChartDataSources[index]);
    if (!dataSourceEnabled) {
      return false;
    }
    if (caseId) return hasCaseVersion;

    return !filterData?.name || filterData?.name === ChartDataSources[index];
  };

  return (
    <div>
      <Box className={classes.display}>
        <Typography variant="h4" component="h4">
          Choose component
        </Typography>
        <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
          {isEnabled(ChartNameIndex.CountOfFileTypes, true) && (
            <ListButton
              icon="PieChart"
              name={Charts[ChartNameIndex.CountOfFileTypes]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.CountOfFileTypesByMonth, true) && (
            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.CountOfFileTypesByMonth]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.FilesCollectedDaily, true) && (
            <ListButton
              icon="MultilineChart"
              name={Charts[ChartNameIndex.FilesCollectedDaily]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.AuditAllUserActivityCategpryByMonth, false) && (
            <ListButton
              icon="MultilineChart"
              name={Charts[ChartNameIndex.AuditAllUserActivityCategpryByMonth]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.Top5UserFiles, true) && (
            <ListButton
              icon="BarChart"
              name={getNameByIndex(ChartNameIndex.Top5UserFiles, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.Top5UserVoiceFiles, true) && (
            <ListButton
              icon="BarChart"
              name={getNameByIndex(ChartNameIndex.Top5UserVoiceFiles, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.Top5UserSMSFiles, true) && (
            <ListButton
              icon="BarChart"
              name={getNameByIndex(ChartNameIndex.Top5UserSMSFiles, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.Top5UserEmailFiles, true) && (
            <ListButton
              icon="BarChart"
              name={getNameByIndex(ChartNameIndex.Top5UserEmailFiles, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.PersonRelationships, true) && (
            <ListButton
              icon="AccountTree"
              name={Charts[ChartNameIndex.PersonRelationships]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.CommsDependencyChart, true) && (
            <ListButton
              icon="DonutLarge"
              name={Charts[ChartNameIndex.CommsDependencyChart]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.WordCount, false) && (
            <ListButton
              icon="TextRotateUp"
              name={Charts[ChartNameIndex.WordCount]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.StockChart, true) && (
            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.StockChart]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {/* Removed - this was the TradStockContext chart */}

          {/* {isEnabled(ChartNameIndex.RealStockChart, false) && (
            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.RealStockChart]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )} */}

          {isEnabled(ChartNameIndex.Timeline, true) && (
            <ListButton
              icon="Timeline"
              name={Charts[ChartNameIndex.Timeline]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {caseId && isEnabled(ChartNameIndex.CaseRelationships, true) && (
            <ListButton
              icon="AccountTree"
              name={Charts[ChartNameIndex.CaseRelationships]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {caseId && isEnabled(ChartNameIndex.CaseTaskGantt, true) && (
            <ListButton
              icon="LineStyle"
              name={Charts[ChartNameIndex.CaseTaskGantt]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.CaseStatusCount, true) && (
            <ListButton
              icon="PieChart"
              name={Charts[ChartNameIndex.CaseStatusCount]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.BarCaseStatus, true) && (
            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.BarCaseStatus]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.CaseStatusCountByDay, true) && (
            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.CaseStatusCountByDay]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.CaseOpenSubtypeCountByDay, true) && (
            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.CaseOpenSubtypeCountByDay]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.CaseAllSubtypeCountByDay, true) && (
            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.CaseAllSubtypeCountByDay]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.TaskOutcome, true) && (
            <ListButton
              icon="PieChart"
              name={Charts[ChartNameIndex.TaskOutcome]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.TaskStatus, true) && (
            <ListButton
              icon="PieChart"
              name={Charts[ChartNameIndex.TaskStatus]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {isEnabled(ChartNameIndex.PieCaseStatusLevel1, true) && (
            <ListButton
              icon="PieChart"
              name={Charts[ChartNameIndex.PieCaseStatusLevel1]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.PieCaseStatusLevel2, true) && (
            <ListButton
              icon="PieChart"
              name={Charts[ChartNameIndex.PieCaseStatusLevel2]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.PieCaseStatusLevel3, true) && (
            <ListButton
              icon="PieChart"
              name={Charts[ChartNameIndex.PieCaseStatusLevel3]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
          {isEnabled(ChartNameIndex.CaseRiskLevel, true) && (
            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.CaseRiskLevel]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {/* Removed - this was the TradStockContext chart */}
          {/* {isEnabled(ChartNameIndex.StockPrice, false) &&

            <ListButton
              icon="BarChart"
              name={Charts[ChartNameIndex.StockPrice]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
            } */}
          {/* {!isFiltered  && ( */}

          {isEnabled(ChartNameIndex.DemoTop50Phrases, true) && (
            <ListButton
              icon="TextRotateUp"
              name={Charts[ChartNameIndex.DemoTop50Phrases]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {isEnabled(ChartNameIndex.DemoTriggeredKeywords, true) && (
            <ListButton
              icon="BarChart"
              name={getNameByIndex(ChartNameIndex.DemoTriggeredKeywords, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {isEnabled(ChartNameIndex.DemoCaseStatusPie, true) && (
            <ListButton
              icon="PieChart"
              name={getNameByIndex(ChartNameIndex.DemoCaseStatusPie, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
 
          {isEnabled(ChartNameIndex.DemoTriggersDaily, true) && (
            <ListButton
              icon="BarChart"
              name={getNameByIndex(ChartNameIndex.DemoTriggersDaily, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {isEnabled(ChartNameIndex.StatusOfCollectorHost, true) && (
            <ListButton
              icon="PieChart"
              name={getNameByIndex(ChartNameIndex.StatusOfCollectorHost, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {isEnabled(ChartNameIndex.StatusOfCollectorCollector, true) && (
            <ListButton
              icon="PieChart"
              name={getNameByIndex(ChartNameIndex.StatusOfCollectorCollector, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {isEnabled(ChartNameIndex.StatusOfCollectorInline, true) && (
            <ListButton
              icon="PieChart"
              name={getNameByIndex(ChartNameIndex.StatusOfCollectorInline, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}

          {isEnabled(ChartNameIndex.StatusOfCollectorOnsite, true) && (
            <ListButton
              icon="PieChart"
              name={getNameByIndex(ChartNameIndex.StatusOfCollectorOnsite, isFiltered)}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
    
          <ListButton
            icon="BarChart"
            name={getNameByIndex(ChartNameIndex.CollectionTotals, isFiltered)}
            data={data}
            clickHandler={_updateComponent}
            config={false}
          />
       
          {isEnabled(ChartNameIndex.Maps, true) && (
            <ListButton
              icon="MapOutlined"
              name={Charts[ChartNameIndex.Maps]}
              data={data}
              clickHandler={_updateComponent}
              config={false}
            />
          )}
        </List>

        {!data?.data?.subItems && !data?.subItems && (
          <Button
            style={{ margin: "10px 0 24px 0" }}
            onClick={() =>
              _updateComponent({
                name: null,
                data: data,
                config: true,
                state: WIZARD_STATE.CHOOSE_COMPONENT,
              })
            }
          >
            <IconManager icon="ArrowBackIos" /> Back
          </Button>
        )}
      </Box>
    </div>
  );
};

export default ChartList;
