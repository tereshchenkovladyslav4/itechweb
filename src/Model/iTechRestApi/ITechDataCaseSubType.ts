﻿
//*************************DO NOT MODIFY**************************
//
//THESE FILES ARE AUTOGENERATED WITH A TYPESCRIPT CODE GENERATION TOOL AND ANY MODIFICATIONS MADE HERE WILL BE LOST.
//PLEASE VISIT http://frhagn.github.io/Typewriter/ TO LEARN MORE ABOUT THIS VISUAL STUDIO EXTENSION
//
//*************************DO NOT MODIFY**************************

import { ITechDataCaseStatusToSubTypeLookup } from "./ITechDataCaseStatusToSubTypeLookup";
import { ITechDataCaseType } from "./ITechDataCaseType";
import { ITechDataTaskOutcome } from "./ITechDataTaskOutcome";



export class ITechDataCaseSubType {
    
    public rowId: number;
    public iTechDataCaseTypeRowId: number | null;
    public abb: string;
    public description: string;
    public iTechDataDefaultWorkFlowRowId: number | null;
    public dateInserted: number | null;
    public dateModified: number | null;
    public dateArchived: number | null;
    public status: number[];
    public guid: number[];
    public signature: number[];
    public iTechDataDefaultTaskRowId: number | null;
    public iTechDataCaseStatusToSubTypeLookups: ITechDataCaseStatusToSubTypeLookup[];
    public iTechDataCaseTypeRow: ITechDataCaseType;
    public iTechDataTaskOutcomes: ITechDataTaskOutcome[];
}


































