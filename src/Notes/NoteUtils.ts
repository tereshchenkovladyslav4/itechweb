import { NoteLinkType } from "../Model/iTechRestApi/NoteLinkType";

const LinkTypeMap = {
    'iTechWebSimAccident': NoteLinkType.accident,
    'iTechWebSim': NoteLinkType.sim,
    'iTechWebAudit': NoteLinkType.auditData, // placeholder for key as need to look at gid too for audits
    'iTechWebTask': NoteLinkType.task,
    'iTechWebSimSalesForce': NoteLinkType.salesForce,
    'iTechWebCaseManagement': NoteLinkType.case,
}

export type LinkTypeKey = keyof typeof LinkTypeMap;
export const getNoteLinkFromDataSource = <K extends keyof typeof LinkTypeMap>(propertyName: K | undefined, gid: number | string | undefined): typeof LinkTypeMap[K] => {
    if (propertyName === undefined) return NoteLinkType.sim;

    if (propertyName === 'iTechWebAudit' && typeof gid === 'string' && gid !== undefined) {
        return gid.startsWith('Data') ? NoteLinkType.auditData : NoteLinkType.auditSim;
    }
    return LinkTypeMap[propertyName];
}
