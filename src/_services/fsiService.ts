import config from "../config";
import { Attachment } from "../Model/iTechRestApi/Attachment";
import { BloombergIm } from "../Model/iTechRestApi/BloombergIm";
import { MsGraphGetChatMsgResponse } from "../Model/iTechRestApi/MsGraphGetChatMsgResponse";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { TextResponse } from "../Model/iTechRestApi/TextResponse";
import { authHeader, authTokenQueryParam } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const fsiService = {
  download,
  downloadPdf,
  audio,
  text,
  email,
  emailAttachments,
  getAttachment,
  // getAttachmentLink,
  pdf,
  properties,
  downloadProperties,
  // getAttachment2,
  getAttachmentLink2,
  downloadReport,
  teamsim,
  videoContent,
  getTeamsPDF,
  bloombergim,
};

export enum RedactionType {
  none = 0,
  strikeout = 1,
  redact = 2,
}

function text(fsiGuid: string, encoding = "UTF8", unzip = "False"): Promise<TextResponse> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechFsi/text/${fsiGuid}?encoding=${encoding}&unzip=${unzip}`,
    requestOptions
  ).then(handleResponse);
}

function download(fsiGuid: string, name: string, rowId?: number): string {
  let path = `${config.apiUrl}/api/iTechFsi/download/${fsiGuid}/${name.replace(/[^\w.-]/gi, "")}`;
  if (rowId !== undefined) {
    path += `?rowId=${rowId}`;
  }
  return authTokenQueryParam(path);
}

function downloadReport(gid: string | number): string {
  return authTokenQueryParam(`${config.apiUrl}/api/iTechWebReport/download/${gid}`);
}

function downloadPdf(filename: string, fsiGuid: string, simRowId: number): string {
  const caseId = sessionStorage.getItem("caseId");
  return authTokenQueryParam(
    `${config.apiUrl}/api/iTechFsi/downloadpdf/${filename?.trim()}/${fsiGuid}/${simRowId}/${caseId}`
  );
}

function downloadProperties(
  filename: string,
  datasource: TableEnum,
  gid: string | number,
  redactiontype: RedactionType = RedactionType.none
): string {
  return authTokenQueryParam(
    `${
      config.apiUrl
    }/api/iTechFsi/downloadproperties/${filename?.trim()}/${datasource}/${gid}/${redactiontype}`
  );
}

function audio(fsiGuid: string, unzip = "False"): string {
  return authTokenQueryParam(`${config.apiUrl}/api/iTechFsi/audio/${fsiGuid}?unzip=${unzip}`);
}

function videoContent(fsiGuid: string): Promise<Array<{ path: string; mimeType: string }>> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechFsi/content/${fsiGuid}`, requestOptions).then(
    handleResponse
  );
}

function email(
  fsiGuid: string,
  simRowId: number,
  redactiontype: RedactionType = RedactionType.none
): string {
  return `${config.apiUrl}/api/iTechFsi/email/${fsiGuid}/${simRowId}/${redactiontype}`;
}

function pdf(
  fileExtension: string,
  fsiGuid: string,
  simRowId: number,
  redactiontype: RedactionType = RedactionType.none
): string {
  // appends the caseId as want to call api for each case as may have different terms applied for redaction
  const caseId = sessionStorage.getItem("caseId");
  return `${
    config.apiUrl
  }/api/iTechFsi/pdf/${fileExtension?.trim()}/${fsiGuid}/${simRowId}/${redactiontype}/${caseId}`;
}

function properties(
  datasource: TableEnum,
  gid: string | number,
  redactiontype: RedactionType = RedactionType.none
): string {
  if (datasource == TableEnum.iTechWebReport)
    return `${config.apiUrl}/api/iTechWebReport/pdf/${gid}`;

  return `${config.apiUrl}/api/iTechFsi/properties/${datasource}/${gid}/${redactiontype}`;
}

function emailAttachments(fsiGuid: string): Promise<Attachment[]> {
  // return `${config.apiUrl}/api/iTechFsi/emailAttachments/${fsiGuid}`;
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechFsi/emailAttachments2/${fsiGuid}`, requestOptions).then(
    handleResponse
  );
}

// function getAttachmentLink(filename: string): string {
//   return `${config.apiUrl}/api/iTechFsi/emailAttachment/${filename}`;
// }

function getAttachment(filename: string): Promise<Blob> {
  // return `${config.apiUrl}/api/iTechFsi/emailAttachments/${filename}`;
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechFsi/emailAttachment/${filename}`, requestOptions)
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      return blob;
    });
}

// just to test pdfs extracted from attachemnts
// function getAttachment2(simRowId:number|undefined, filename: string, redactiontype: RedactionType): Promise<Blob> {
//   // return `${config.apiUrl}/api/iTechFsi/emailAttachments/${filename}`;
//   const requestOptions = { method: "GET", headers: authHeader() };
//   return fetch(`${config.apiUrl}/api/iTechFsi/emailAttachment2/${simRowId}/${filename}/${redactiontype}`, requestOptions)
//     .then((res) => {
//       return res.blob();
//     })
//     .then((blob) => {
//       return blob;
//     });
// }

function getAttachmentLink2(
  fsiGuid: string,
  simRowId: number,
  filename: string,
  redactiontype: RedactionType = RedactionType.none
): string {
  return `${config.apiUrl}/api/iTechFsi/emailAttachment2/${simRowId}/${filename}/${redactiontype}`;
}

function getTeamsPDF(simRowId: string | number, etag: string): string {
  return authTokenQueryParam(`${config.apiUrl}/api/iTechFsi/teamspdf/${simRowId}/${etag}`);
}

async function teamsim(
  simRowId: string | number,
  fsiGuid: string
): Promise<MsGraphGetChatMsgResponse[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/api/iTechFsi/teamsim/${simRowId}/${fsiGuid}`,
    requestOptions
  ).then(handleResponse);
}

async function bloombergim(simRowId: string | number, fsiGuid: string): Promise<BloombergIm[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/api/iTechFsi/bloombergim/${simRowId}/${fsiGuid}`,
    requestOptions
  ).then(handleResponse);
}
