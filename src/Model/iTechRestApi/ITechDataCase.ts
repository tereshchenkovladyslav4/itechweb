﻿
//*************************DO NOT MODIFY**************************
//
//THESE FILES ARE AUTOGENERATED WITH A TYPESCRIPT CODE GENERATION TOOL AND ANY MODIFICATIONS MADE HERE WILL BE LOST.
//PLEASE VISIT http://frhagn.github.io/Typewriter/ TO LEARN MORE ABOUT THIS VISUAL STUDIO EXTENSION
//
//*************************DO NOT MODIFY**************************

import { ITechDataUser } from "./ITechDataUser";
import { ITechDataCaseSecurityObject } from "./ITechDataCaseSecurityObject";
import { IRowId } from "./IRowId";



export class ITechDataCase implements IRowId {
    
    public rowId: number;
    public dateInserted: number | null;
    public dateModified: number | null;
    public dateArchived: number | null;
    public status: number[];
    public name: string;
    public summary: string;
    public guid: number[];
    public signature: number[];
    public iTechControlCaseStatusTypeRowId: number | null;
    public iTechDataCaseStatusTypeRowId: number | null;
    public iTechDataSecurityObjectRowId: number | null;
    public iTechDataCaseParentRowId: number | null;
    public summaryText: string;
    public iTechDataInvestigatorSecurityObjectRowId: number | null;
    public caseReference: string;
    public legalHold: boolean | null;
    public iTechDataCaseTypeRowId: number | null;
    public iTechDataCaseSubTypeRowId: number | null;
    public subjectName: string;
    public subjectEmail: string;
    public subjectMobile: string;
    public subjectPhone: string;
    public subjectStreet: string;
    public subjectCity: string;
    public subjectPostCode: string;
    public subjectCountry: string;
    public dateInitiated: number | null;
    public iTechDataUserRowId: number | null;
    public dateDue: number | null;
    public iTechDataCaseOutcomeTypeRowId: number | null;
    public subjectForename: string;
    public subjectSurname: string;
    public subjectPreviousSurname: string;
    public subjectDob: string;
    public subjectEmailConfirm: boolean | null;
    public args: string;
    public iTechDataRiskTypeRowId: number | null;
    public iTechDataLevelTypeRowId: number | null;
    public iTechDataUser: ITechDataUser;
    public iTechDataCaseSecurityObjects: ITechDataCaseSecurityObject[];
}


































