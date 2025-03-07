﻿
//*************************DO NOT MODIFY**************************
//
//THESE FILES ARE AUTOGENERATED WITH A TYPESCRIPT CODE GENERATION TOOL AND ANY MODIFICATIONS MADE HERE WILL BE LOST.
//PLEASE VISIT http://frhagn.github.io/Typewriter/ TO LEARN MORE ABOUT THIS VISUAL STUDIO EXTENSION
//
//*************************DO NOT MODIFY**************************

import { ITechDataTeam } from "./ITechDataTeam";
import { ITechDataUserToRole } from "./ITechDataUserToRole";
import { ITechDataUser } from "./ITechDataUser";



export class ITechDataCompany {
    
    public rowId: number;
    public name: string;
    public isExternal: boolean | null;
    public iTechDataCompanyParentRowId: number | null;
    public description: string;
    public guid: number[];
    public signature: number[];
    public dateInserted: number | null;
    public dateModified: number | null;
    public dateArchived: number | null;
    public status: number[];
    public externalReference: string;
    public regulatedSeller: boolean | null;
    public entity: string;
    public riskRating: string;
    public incorporatedIn: string;
    public iTechDataTeams: ITechDataTeam[];
    public iTechDataUserToRoles: ITechDataUserToRole[];
    public iTechDataUsers: ITechDataUser[];
}


































