﻿
//*************************DO NOT MODIFY**************************
//
//THESE FILES ARE AUTOGENERATED WITH A TYPESCRIPT CODE GENERATION TOOL AND ANY MODIFICATIONS MADE HERE WILL BE LOST.
//PLEASE VISIT http://frhagn.github.io/Typewriter/ TO LEARN MORE ABOUT THIS VISUAL STUDIO EXTENSION
//
//*************************DO NOT MODIFY**************************

import { ITechControlDatabaseSchemaType } from "./ITechControlDatabaseSchemaType";
import { ITechControlDatabaseType } from "./ITechControlDatabaseType";
import { ITechControlFsicatalog } from "./ITechControlFsicatalog";
import { ITechControlGlobal } from "./ITechControlGlobal";
import { ITechControlHolderCatalog } from "./ITechControlHolderCatalog";
import { ITechControlHost } from "./ITechControlHost";
import { ITechControlMap } from "./ITechControlMap";
import { ITechControlRegion } from "./ITechControlRegion";
import { ITechControlSchema } from "./ITechControlSchema";
import { ITechControlServicesToHostsToServiceTypeToDatabase } from "./ITechControlServicesToHostsToServiceTypeToDatabase";
import { ITechControlTrackingType } from "./ITechControlTrackingType";
import { ITechControlTreeRootPath } from "./ITechControlTreeRootPath";



export class ITechControlDatabase {
    
    public rowId: number;
    public iTechControlGlobalRowId: number | null;
    public iTechControlRegionRowId: number | null;
    public iTechControlSourceTypeRowId: number | null;
    public iTechControlHostRowId: number | null;
    public iTechControlOnLineStatusTypeRowId: number | null;
    public isPrimaryWriteable: boolean | null;
    public iTechControlDatabaseParentRowId: number | null;
    public iTechControlSyncParentRowId: number | null;
    public iTechControlDatabaseTypeRowId: number | null;
    public iTechControlDatabaseSchemaTypeRowId: number | null;
    public iTechControlCollectionProcessRulesTypeRowId: number | null;
    public iTechControlIndexTypeRowId: number | null;
    public iTechControlCollectionRowId: number | null;
    public isDummyCollection: boolean | null;
    public databaseName: string;
    public details: string;
    public folderName: string;
    public basePathMappingRowId: number | null;
    public extendedPathMappingRowId: number | null;
    public sourcePathMappingRowId: number | null;
    public connectionString: string;
    public loginName: string;
    public password: string;
    public rootFolder: string;
    public iTechControlDatabaseMappingMethodRowId: number | null;
    public iTechControlStorageMethodTypeRowId: number | null;
    public iTechControlStorageReplicationTypeRowId: number | null;
    public iTechControlStorageReplicationInterval: number | null;
    public isSpinFromSource: boolean | null;
    public isWatchable: boolean | null;
    public iTechControlHolderActionRestartTypeRowId: number | null;
    public restartMinInterval: number | null;
    public restartInterval: number | null;
    public maxRunTime: number | null;
    public isDuplicationRequired: boolean | null;
    public deDeuplicationWaitTimeSeconds: number | null;
    public iTechControlSchemaRowId: number | null;
    public blockSize: number | null;
    public inheritFromSource: boolean | null;
    public updateFromSource: boolean | null;
    public iTechDataStoragePolicyRowId: number | null;
    public iTechDataRetentionPolicyRowId: number | null;
    public iTechDataClassificationPolicyRowId: number | null;
    public collectionAuthorisationBinaryAssignmentRules: number[];
    public collectionAuthorisationBinaryRules: number | null;
    public iTechDataSecurityObjectRowId: number | null;
    public isManaged: boolean | null;
    public isCollector: boolean | null;
    public isRecoverableTo: boolean | null;
    public isStubable: boolean | null;
    public stubFrequency: number | null;
    public isSynchronisable: boolean | null;
    public synchronisationFrequency: number | null;
    public indexMaxSize: number | null;
    public currentDayIndex: number | null;
    public dateValidated: number | null;
    public limitMb: number | null;
    public isIncludeFilter: boolean | null;
    public filter: string;
    public contractRowId: number | null;
    public isAttachment: boolean | null;
    public extractDocuments: boolean | null;
    public indexTime: number | null;
    public dateInserted: number | null;
    public dateModified: number | null;
    public dateArchived: number | null;
    public status: number[];
    public guid: number[];
    public signature: number[];
    public iTechControlTrackingTypeRowId: number | null;
    public truSubscriberId: number | null;
    public comment1: string;
    public comment2: string;
    public customArgs: string;
    public iTechControlProcessGridRowId: number | null;
    public resetActionHolderOnStart: boolean | null;
    public stTime: number | null;
    public edTime: number | null;
    public serviceIntervalResetAction: number | null;
    public isCrawlable: boolean | null;
    public crawlFrequency: number | null;
    public decryptionPrivateKey: string;
    public iTechControlCollectionTypeRowId: number | null;
    public iTechControlSimFsiMethodTypeRowId: number | null;
    public isVersionControlEnabled: boolean | null;
    public iTechControlSimAggregateTypeRowId: number | null;
    public iTechControlSimIdentificationFormatTypeRowId: number | null;
    public iTechControlSimFsiOptionsTypeRowId: number | null;
    public defaultOwnerUserIdentifier: string;
    public iTechControlDatabaseParentRow: ITechControlDatabase;
    public iTechControlDatabaseSchemaTypeRow: ITechControlDatabaseSchemaType;
    public iTechControlDatabaseTypeRow: ITechControlDatabaseType;
    public iTechControlFsicatalogs: ITechControlFsicatalog[];
    public iTechControlGlobalRow: ITechControlGlobal;
    public iTechControlHolderCatalogs: ITechControlHolderCatalog[];
    public iTechControlHostRow: ITechControlHost;
    public iTechControlMapITechControlDatabaseRealRows: ITechControlMap[];
    public iTechControlMapITechControlDatabaseVirtualRows: ITechControlMap[];
    public iTechControlRegionRow: ITechControlRegion;
    public iTechControlSchemaRow: ITechControlSchema;
    public iTechControlServicesToHostsToServiceTypeToDatabases: ITechControlServicesToHostsToServiceTypeToDatabase[];
    public iTechControlTrackingTypeRow: ITechControlTrackingType;
    public iTechControlTreeRootPaths: ITechControlTreeRootPath[];
    public inverseITechControlDatabaseParentRow: ITechControlDatabase[];
}


































