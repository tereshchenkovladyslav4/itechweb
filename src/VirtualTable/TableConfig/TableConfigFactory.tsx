import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import BaseTableConfig from "./BaseTableConfig";
import ITableConfig from "./ITableConfig";
import ITechStockHeaderConfig from "./ITechStockHeaderConfig";
import ITechStockOrderManagementConfig from "./ITechStockOrderManagementConfig";
import ITechStockQuoteConfig from "./ITechStockQuoteConfig";
import ITechWebAlertConfig from "./ITechWebAlertConfig";
import ITechWebAuditConfig from "./ITechWebAuditConfig";
import ITechWebCaseManagementConfig from "./ITechWebCaseManagementConfig";
import ITechWebEodhdNewsConfig from "./ITechWebEodhdNewsConfig";
import ITechWebHrConfig from "./ITechWebHrConfig";
import ITechWebLexiconConfig from "./ITechWebLexiconConfig";
import ITechWebLexiconGroupConfig from "./ITechWebLexiconGroupConfig";
import ITechWebReportConfig from "./ITechWebReportConfig";
import ITechWebReportConfigurationConfig from "./ITechWebReportConfigurationConfig";
import ITechWebReportingAssureConfig from "./ITechWebReportingAssureConfig";
import ITechWebRuleConfig from "./ITechWebRuleConfig";
import ITechWebSecurityObjectConfig from "./ITechWebSecurityObjectConfig";
import iTechWebSimCiscoRawCdrConfig from "./iTechWebSimCiscoRawCdrConfig";
import ITechWebSimConfig from "./ITechWebSimConfig";
import iTechWebSimIpcUnigyRawCdrConfig from "./iTechWebSimIpcUnigyRawCdrConfig";
import iTechWebSimNiceRawVoiceCdrConfig from "./iTechWebSimNiceRawVoiceCdrConfig";
import ITechWebSimUploadConfig from "./ITechWebSimUploadConfig";
import ITechWebStockOrderConfig from "./ITechWebStockOrderConfig";
import ITechWebSurveillanceConfig from "./ITechWebSurveillanceConfig";
import ITechWebTaskConfig from "./ITechWebTaskConfig";
import ITechWebTaskOwnerConfig from "./ITechWebTaskOwnerConfig";
import ITechWebTermConfig from "./ITechWebTermConfig";
import ITechWebUserConfig from "./ITechWebUserConfig";
import ITechWebUserGroupConfig from "./ITechWebUserGroupConfig";

const _configs: ITableConfig[] = [
  new ITechStockOrderManagementConfig(),
  new ITechStockQuoteConfig(),
  new ITechStockHeaderConfig(),
  new ITechWebAlertConfig(),
  new ITechWebAuditConfig(),
  new ITechWebCaseManagementConfig(),
  new ITechWebLexiconConfig(),
  new ITechWebLexiconGroupConfig(),
  new ITechWebReportConfig(),
  new ITechWebReportConfigurationConfig(),
  new ITechWebRuleConfig(),
  new ITechWebSecurityObjectConfig(),
  new ITechWebSimConfig(),
  new ITechWebSimUploadConfig(),
  new ITechWebSurveillanceConfig(),
  new ITechWebTaskConfig(),
  new ITechWebTaskOwnerConfig(),
  new ITechWebTermConfig(),
  new ITechWebUserConfig(),
  new ITechWebUserGroupConfig(),
  new ITechWebHrConfig(),
  new ITechWebStockOrderConfig(),
  new ITechWebEodhdNewsConfig(),
  new ITechWebReportingAssureConfig(),
  new iTechWebSimIpcUnigyRawCdrConfig(),
  new iTechWebSimCiscoRawCdrConfig(),
  new iTechWebSimNiceRawVoiceCdrConfig(),
];

export default function tableConfigFactory(dataSource: keyof typeof TableEnum): ITableConfig {
  const config = _configs.find((x) => TableEnum[x.dataSource] === dataSource);
  return config ?? new BaseTableConfig(TableEnum[dataSource]);
}
