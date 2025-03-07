﻿
//*************************DO NOT MODIFY**************************
//
//THESE FILES ARE AUTOGENERATED WITH A TYPESCRIPT CODE GENERATION TOOL AND ANY MODIFICATIONS MADE HERE WILL BE LOST.
//PLEASE VISIT http://frhagn.github.io/Typewriter/ TO LEARN MORE ABOUT THIS VISUAL STUDIO EXTENSION
//
//*************************DO NOT MODIFY**************************

import { ITechAudit } from "./ITechAudit";
import { ITechControlAuditCategoryType } from "./ITechControlAuditCategoryType";
import { ITechControlAuditSeverityType } from "./ITechControlAuditSeverityType";



export class ITechControlAuditEventType {
    
    public rowId: number;
    public dateInserted: number | null;
    public dateModified: number | null;
    public dateArchived: number | null;
    public status: number[];
    public iTechControlAuditCategoryTypeRowId: number | null;
    public iTechControlAuditSeverityTypeRowId: number | null;
    public iTechAuditId: number;
    public abb: string;
    public description: string;
    public isReplicationProdToAdmin: boolean | null;
    public isReplicationAdminToProd: boolean | null;
    public guid: number[];
    public signature: number[];
    public display: boolean | null;
    public iTechAudits: ITechAudit[];
    public iTechControlAuditCategoryTypeRow: ITechControlAuditCategoryType;
    public iTechControlAuditSeverityTypeRow: ITechControlAuditSeverityType;
}


































