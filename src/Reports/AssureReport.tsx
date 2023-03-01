import React, { useState, useEffect } from "react";
import { Grid, Portal, Tab, Tabs, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { trackPromise } from "react-promise-tracker";
import { AssureReport } from "../Model/iTechRestApi/TableModel";
import { assureService } from "../_services/assureService";
import DatePicker from "react-datepicker";
import { random } from "lodash";
import { ChartNameIndex } from "../Chart/IFilteredChart";
import { iTechControlColumnEnum } from "../Model/iTechRestApi/iTechControlColumnEnum";
import BarChart from "../Chart/HighChartBarChart";
import PieChart from "../Chart/HighChartPieChart";
import VirtualTable from "../VirtualTable/VirtualTable";
import ITechWebReportingAssureConfig from "../VirtualTable/TableConfig/ITechWebReportingAssureConfig";
import BasicTable from "./BasicTable";
import TabPanel from "./TabPanel";
import LoadingSpinner from "../_components/LoadingSpinner";

interface IAssureReportProps {
  service: typeof assureService;
  area: string;
  updateData(arg: any): any;
  data: any;
}

const dateFormat = "dd/MM/yyyy"; // display format

const assureReportConfig = new ITechWebReportingAssureConfig();
assureReportConfig.hideCheckBox = true;
assureReportConfig.tableActions = () => [];

const voidUpdateVirtualTable = () => {
  // const data = { ...component.data, ...tableParams };
  // delete data.columns;
  // data.subItems = tableParams.columns;
  // componentService.json(component.rowId, data).then(() => dataIsSet(component.rowId, data));
};
const voidUpdateData = () => {
  // const comp = component;
  // comp.data = data;
  // comp.json = JSON.stringify(data);
  // componentService.json(comp.rowId, data).then(() => {
  //   setData(data);
  //   dataIsSet(comp.rowId, data);
  // });
};

const config: any = {
  description: "Assure Report",
  icon: "Summarize",
  name: "iTechWebReportingAssure",
  sortBy: "rowId",
  subItems: [
    {
      name: "checkbox",
      minWidth: 40,
    },
    {
      name: "rowId",
      description: "Test ID",
      iTechControlColumnTypeRowId: 5,
      gridIndex: 0,
      gridSelected: true,
      minWidth: 50,
      rowId: 423,
      helperText: "Number",
    },
    {
      name: "testCode",
      description: "Test Code",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 1,
      gridSelected: true,
      minWidth: 70,
      rowId: 424,
      helperText: "Text",
    },
    {
      name: "lastSuccessfulTestDateUtcString",
      description: "Date UTC",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 2,
      gridSelected: true,
      minWidth: 70,
      rowId: 425,
      helperText: "yyyy-MM-dd HH:mm:ss",
    },
    {
      name: "identifier",
      description: "Identifier",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 3,
      gridSelected: true,
      minWidth: 70,
      rowId: 426,
      helperText: "Text",
    },
    {
      name: "numPlanOwnerForename",
      description: "Forename",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 4,
      gridSelected: true,
      minWidth: 70,
      rowId: 427,
      helperText: "Text",
    },
    {
      name: "numPlanOwnerSurname",
      description: "Surname",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 5,
      gridSelected: true,
      minWidth: 70,
      rowId: 428,
      helperText: "Text",
    },
    {
      name: "numPlanOwnerRole",
      description: "Role",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 6,
      gridSelected: true,
      minWidth: 100,
      rowId: 429,
      helperText: "Text",
    },
    {
      name: "office",
      description: "Office",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 7,
      gridSelected: true,
      minWidth: 70,
      rowId: 430,
      helperText: "Text",
    },
    {
      name: "source_System",
      description: "Source System",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 8,
      gridSelected: true,
      minWidth: 70,
      rowId: 431,
      helperText: "Text",
    },
    {
      name: "lineType",
      description: "Line Type",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 9,
      gridSelected: true,
      minWidth: 70,
      rowId: 432,
      helperText: "Text",
    },
    {
      name: "device",
      description: "Device",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 10,
      gridSelected: true,
      minWidth: 70,
      rowId: 433,
      helperText: "Text",
    },
    {
      name: "recorder",
      description: "Recorder",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 11,
      gridSelected: true,
      minWidth: 70,
      rowId: 434,
      helperText: "Text",
    },
    {
      name: "channel",
      description: "Channel",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 12,
      gridSelected: true,
      minWidth: 70,
      rowId: 435,
      helperText: "Text",
    },
    {
      name: "policyName",
      description: "Policy Name",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 13,
      gridSelected: true,
      minWidth: 70,
      rowId: 436,
      helperText: "Text",
    },
    {
      name: "testType",
      description: "Test Type",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 14,
      gridSelected: true,
      minWidth: 70,
      rowId: 437,
      helperText: "Text",
    },
    {
      name: "lineTestOutcome",
      description: "Line Test Outcome",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 15,
      gridSelected: true,
      minWidth: 70,
      rowId: 438,
      helperText: "Text",
    },
    {
      name: "reason",
      description: "Reason",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 16,
      gridSelected: true,
      minWidth: 100,
      rowId: 439,
      helperText: "Text",
    },
    {
      name: "detail",
      description: "Detail",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 17,
      gridSelected: true,
      minWidth: 100,
      rowId: 440,
      helperText: "Text",
    },
    {
      name: "recordingProfileName",
      description: "Recording Profile Name",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 18,
      gridSelected: true,
      minWidth: 70,
      rowId: 441,
      helperText: "Text",
    },
    {
      name: "recordMixName",
      description: "Record Mix Name",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 19,
      gridSelected: true,
      minWidth: 70,
      rowId: 442,
      helperText: "Text",
    },
    {
      name: "lastCallDateUtcString",
      description: "Last Call Date",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 20,
      gridSelected: true,
      minWidth: 70,
      rowId: 443,
      helperText: "yyyy-MM-dd HH:mm:ss",
    },
    {
      name: "lastSuccessfulTestDateUtcString",
      description: "Last Test Date",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 21,
      gridSelected: true,
      minWidth: 70,
      rowId: 444,
      helperText: "yyyy-MM-dd HH:mm:ss",
    },
    {
      name: "qualityOutcome",
      description: "Quality Outcome",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 22,
      gridSelected: true,
      minWidth: 70,
      rowId: 445,
      helperText: "Text",
    },
    {
      name: "qualityMeasure",
      description: "Quality Measure",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 23,
      gridSelected: true,
      minWidth: 70,
      rowId: 446,
      helperText: "Text",
    },
    {
      name: "transcript",
      description: "Transcript",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 24,
      gridSelected: false,
      minWidth: 100,
      rowId: 447,
      helperText: "Text",
    },
    // {
    //     "name": "select",
    //     "minWidth": 50
    // }
  ],
};

const useAssureStyles = makeStyles((theme) => ({
  chart: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const AssureReportDisplay: React.FC<IAssureReportProps> = ({ area, service, updateData, data }) => {
  const [reportDate, setReportDate] = useState<Date>(
    data?.data?.reportDate ? new Date(data?.data?.reportDate) : new Date()
  );
  const [assureReportData, setAssureReportData] = useState<AssureReport>();

  const [endDate] = useState(new Date());
  const [value, setValue] = React.useState(0);
  const classes = useAssureStyles();
  const chart1area = "chart1-" + random() * 100;
  const chart2area = "chart2-" + random() * 100;
  const virtualTableWidth = 3600;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (reportDate) {
      data.data = { reportDate: reportDate };
      updateData(data);
      setAssureReportData(undefined);
      trackPromise(service.get(reportDate.toDateString()), area).then((rsp) => {
        setAssureReportData(rsp);
      });
    }
  }, [reportDate]);

  const _container = ({ children }: any) => {
    return <Portal>{children}</Portal>;
  };

  function a11yProps(index: number) {
    return {
      id: `report-tab-${index}`,
      "aria-controls": `report-tabpanel-${index}`,
    };
  }

  const getBarChartData = () => {
    if (assureReportData?.summary?.lineTestStatus) {
      const names = assureReportData.summary.lineTestStatus.header.slice(1, -1);
      const rows = assureReportData.summary.lineTestStatus.data.slice(0, -1);

      const val = names.map((s, i) =>
        rows.reduce((a, r) => ({ ...a, [r[0]]: r[i + 1] }), { name: names[i] })
      );
      //   const t = names.reduce((a,v,i) => ({...a, [v]:rows.map((r) => r[i+1])}), {});
      //   const chartData = data.summary.lineTestStatus.data.map((r, i) => {
      //     r.map((c, ci) => ({ name: r[0] }));
      //   });
      return val;
    }
    return [];
  };

  const getPieChartData = () => {
    if (assureReportData?.summary?.userComplianceStatus) {
      const names = assureReportData.summary.userComplianceStatus.data
        .slice(0, -1)
        .map((x) => x[0]); // 1st column exluding last entry
      const rows = assureReportData.summary.userComplianceStatus.data
        .slice(0, -1)
        .map((x) => x[x.length - 1]); // use the totals column

      // const val = names.map((n, i) => ({ name: toSentence(n), count: rows[i] }));
      const val = names.map((n, i) => ({ name: n, count: rows[i] }));

      return val;
    }
    return [];
  };

  const barArray = getBarChartData();
  const pieArray = getPieChartData();

  return (
    // datepicker for report - ( Rob said treeview - not sure of what?)
    <Grid container xs={12} padding={2} height="calc(100% - 100px)">
      <Grid item xs={12}>
        <Typography component={"label"}>Report Date:</Typography>
        <DatePicker
          selected={reportDate}
          onChange={(date) => setReportDate(date as Date)}
          dateFormat={dateFormat}
          popperContainer={_container}
          todayButton="Today"
          maxDate={endDate}
        />
        {!assureReportData && assureReportData !== undefined && (
          <Typography variant="body1" padding={2}>
            No Data
          </Typography>
        )}
        {/* <LoadingSpinner area={area} fixed={false} /> */}
      </Grid>

      {assureReportData && (
        <>
          <Tabs value={value} onChange={handleChange} aria-label="report tabs">
            <Tab label="Summary" {...a11yProps(0)} />
            <Tab label="Detail" {...a11yProps(1)} />
            <Tab label="Config Issues" {...a11yProps(2)} />
            <Tab label="Failed Line Tests" {...a11yProps(3)} />
            <Tab label="Offline Users" {...a11yProps(4)} />
            <Tab label="Profile Errors" {...a11yProps(5)} />
            <Tab label="Data" {...a11yProps(6)} />
          </Tabs>

          <TabPanel value={value} index={0} minWidth={2200}>
            <Grid container item xs={12} paddingTop={2}>
              <>
                <Grid item xs={2} className={classes.chart}>
                  {/* <ChartMenuWrapper
                    Chart={PieChart}
                    //   callback={onChartMenuSelected}
                    opt={{
                      area: chart1area,
                      dataKey: "name",
                      data: pieArray, //data.summary.lineTestStatus.data,
                      //colors: DefaultColors,
                      dataValue: ["count"], // columns - need the 1st column excluding top / bottom
                      seriesName: "data",
                      // title: "",
                      chartIndex: ChartNameIndex.AssureComplainceStatus,
                    }}
                  /> */}
                  <PieChart
                    area={chart1area}
                    dataValue={["count"]}
                    dataKey="name"
                    seriesName="data"
                    chartIndex={ChartNameIndex.AssureComplainceStatus}
                    data={pieArray}
                  />
                </Grid>
                <Grid item xs={5}>
                  <BasicTable model={assureReportData.summary.userComplianceStatus} />
                </Grid>
                <Grid item xs={5}>
                  <BasicTable model={assureReportData.summary.notCompliantReason} />
                </Grid>
              </>
            </Grid>
            <Grid container item xs={12} paddingTop={2}>
              <>
                <Grid item xs={2}>
                  {/* <ChartMenuWrapper
                    Chart={BarChart}
                    //   callback={onChartMenuSelected}
                    opt={{
                      area: chart2area,
                      dataKey: "name",
                      data: arr,
                      //colors: DefaultColors,
                      dataValue: assureReportData.summary.lineTestStatus.data.map((r) => r[0]), // columns - need the 1st column excluding top / bottom
                      seriesName: "data",
                      // title: "",
                      chartIndex: ChartNameIndex.AssureLineStatus,
                    }}
                  /> */}
                  <BarChart
                    area={chart2area}
                    dataValue={assureReportData.summary.lineTestStatus.data
                      .map((r) => r[0])
                      ?.slice(0, -1)} // columns - need the 1st column excluding bottom
                    dataKey="name"
                    seriesName="data"
                    chartIndex={ChartNameIndex.AssureLineStatus}
                    data={barArray}
                  />
                </Grid>
                <Grid item xs={5}>
                  <BasicTable model={assureReportData.summary.lineTestStatus} />
                </Grid>
                <Grid item xs={5}>
                  <BasicTable model={assureReportData.summary.status} />
                </Grid>
              </>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={1} minWidth={1800}>
            <Grid container item xs={12} paddingTop={2} paddingLeft={1}>
              <>
                <Grid item xs={4}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: "underline", marginBottom: 2, fontWeight: "bold" }}
                  >
                    OVERVIEW
                  </Typography>
                  <BasicTable model={assureReportData.detail.sourceSystem} minWidth={400} />
                </Grid>
                <Grid item xs={7}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: "underline", marginBottom: 2, fontWeight: "bold" }}
                  >
                    FAILED LINE TEST REASONS
                  </Typography>
                  <BasicTable model={assureReportData.detail.failedLineTest} />
                </Grid>
                <Grid item xs={1}></Grid>
              </>
            </Grid>
            <Grid container item xs={12} paddingTop={2} paddingLeft={1}>
              <>
                <Grid item xs={4}>
                  <BasicTable model={assureReportData.detail.recorder} minWidth={400} />
                </Grid>

                <Grid item xs={5}>
                  <BasicTable model={assureReportData.detail.office} minWidth={400} />
                </Grid>
                <Grid item xs={3}></Grid>
              </>
            </Grid>

            <Grid container item xs={12} paddingTop={2} paddingLeft={1}>
              <Typography
                variant="body1"
                sx={{ textDecoration: "underline", marginBottom: 2, fontWeight: "bold" }}
              >
                QUALITY TEST ANALYSIS
              </Typography>
            </Grid>

            <Grid container item xs={12} paddingTop={2} paddingLeft={1}>
              <>
                <Grid item xs={3}>
                  <BasicTable model={assureReportData.detail.qualityOutcome} minWidth={300} />
                </Grid>
                <Grid item xs={3}>
                  <BasicTable model={assureReportData.detail.qualitySource} minWidth={300} />
                </Grid>
                <Grid item xs={3}>
                  <BasicTable model={assureReportData.detail.qualityRecorder} minWidth={300} />
                </Grid>
                <Grid item xs={3}>
                  <BasicTable model={assureReportData.detail.qualityOffice} minWidth={300} />
                </Grid>
              </>
            </Grid>

            <Grid container item xs={12} paddingTop={2} paddingLeft={1}>
              <Typography
                variant="body1"
                sx={{ textDecoration: "underline", marginBottom: 2, fontWeight: "bold" }}
              >
                RECORDINGS ANALYSIS
              </Typography>
            </Grid>

            <Grid container item xs={12} paddingTop={2} paddingLeft={1}>
              <>
                <Grid item xs={5}>
                  <BasicTable model={assureReportData.detail.recordingsAnalysis} />
                </Grid>
              </>
            </Grid>

            <Grid container item xs={12} paddingTop={2} paddingLeft={1}>
              <Typography
                variant="body1"
                sx={{ textDecoration: "underline", marginBottom: 2, fontWeight: "bold" }}
              >
                UNIGY RECORD MIX DETAILS
              </Typography>
            </Grid>

            <Grid container item xs={12} paddingTop={2} paddingLeft={1}>
              <>
                <Grid item xs={5}>
                  <BasicTable model={assureReportData.detail.mixDetailTestCode} />
                </Grid>
                <Grid item xs={5}>
                  <BasicTable model={assureReportData.detail.mixDetailLineTestOutcome} />
                </Grid>
              </>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={2} minWidth={virtualTableWidth}>
            <VirtualTable
              configUpdate={voidUpdateVirtualTable}
              updateData={voidUpdateData}
              area={area}
              setup={config}
              fixedFilters={[
                {
                  name: "testCode",
                  value: "ConfigIssue",
                  operation: "Equals",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
                {
                  name: "reportDateLocalTimeString",
                  value: reportDate.toISOString().split("T")[0],
                  operation: "contains",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
              ]}
              config={assureReportConfig}
            />
          </TabPanel>
          <TabPanel value={value} index={3} minWidth={virtualTableWidth}>
            <VirtualTable
              configUpdate={voidUpdateVirtualTable}
              updateData={voidUpdateData}
              area={area}
              setup={config}
              fixedFilters={[
                {
                  name: "lineTestOutcome",
                  value: "Failed",
                  operation: "Equals",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
                {
                  name: "reportDateLocalTimeString",
                  value: reportDate.toISOString().split("T")[0],
                  operation: "contains",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
              ]}
              config={assureReportConfig}
            />
          </TabPanel>
          <TabPanel value={value} index={4} minWidth={virtualTableWidth}>
            <VirtualTable
              configUpdate={voidUpdateVirtualTable}
              updateData={voidUpdateData}
              area={area}
              setup={config}
              fixedFilters={[
                {
                  name: "testCode",
                  value: "Offline",
                  operation: "Equals",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
                {
                  name: "reportDateLocalTimeString",
                  value: reportDate.toISOString().split("T")[0],
                  operation: "contains",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
              ]}
              config={assureReportConfig}
            />
          </TabPanel>
          <TabPanel value={value} index={5} minWidth={virtualTableWidth}>
            <VirtualTable
              configUpdate={voidUpdateVirtualTable}
              updateData={voidUpdateData}
              area={area}
              setup={config}
              fixedFilters={[
                {
                  name: "testCode",
                  value: "ConfigIssue",
                  operation: "Equals",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
                {
                  name: "detail",
                  value: "recording",
                  operation: "Contains",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
                {
                  name: "reportDateLocalTimeString",
                  value: reportDate.toISOString().split("T")[0],
                  operation: "contains",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
              ]}
              config={assureReportConfig}
            />
          </TabPanel>
          <TabPanel value={value} index={6} minWidth={virtualTableWidth}>
            <VirtualTable
              configUpdate={voidUpdateVirtualTable}
              updateData={voidUpdateData}
              area={area}
              setup={config}
              fixedFilters={[
                {
                  name: "reportDateLocalTimeString",
                  value: reportDate.toISOString().split("T")[0],
                  operation: "contains",
                  iTechControlColumnType: iTechControlColumnEnum.string,
                  iTechControlColumnTypeRowId: 9,
                  rowId: 0,
                  filters: [],
                  isLogin: false,
                },
              ]}
              config={assureReportConfig}
            />
          </TabPanel>
        </>
      )}
    </Grid>
  );
};

export default AssureReportDisplay;
