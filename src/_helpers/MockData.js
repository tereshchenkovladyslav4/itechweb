import faker from "faker";
import React from "react";

var data = [];
var users = [];
var tree = [];
var keyTypeData = [
    {
       "rowId":1,
       "abb":"iTechSim",
       "description":"Files",
       "id":"1-parent",
       "subItems":[
          {
             "rowId":5,
             "abb":"owner",
             "description":"Owner",
             "datatype":"User",
             "id":"5-child",
             "checked":true,
             "index":0
          },
          {
             "rowId":9,
             "abb":"iTechControlFileTypeRowId",
             "description":"File Type",
             "datatype":"Type",
             "id":"9-child",
             "checked":true,
             "index":1
          },
          {
             "rowId":2,
             "abb":"dateInserted",
             "description":"Date Inserted",
             "datatype":"DateTime",
             "id":"2-child",
             "checked":true,
             "index":2
          },
          {
             "rowId":3,
             "abb":"summary",
             "description":"Summary",
             "datatype":"String",
             "id":"3-child",
             "checked":true,
             "index":3
          },
          {
             "rowId":4,
             "abb":"duration",
             "description":"Duration",
             "datatype":"Int",
             "id":"4-child",
             "checked":true,
             "index":4
          },
          {
             "rowId":8,
             "abb":"hasAttachment",
             "description":"Attachment",
             "datatype":"Boolean",
             "id":"8-child",
             "checked":true,
             "index":5
          }
       ],
       "type":"iTechSim",
       "checked":true,
       "index":0
    }
 ];

var filters = [{
    "name": "Save 1",
    "rowId": 1,
    "dataSources": [
    {
       "rowId":1,
       "id":1,
       "filters":[
          {
             "id":1,
             "columnName":"Column-1-1",
             "rowId":2,
             "operation":"",
             "value":"2020-09-06 13:15,2020-09-17 08:15",
             "operationName":"Operation-1-1",
             "valueName":"Value-1-1"
          },
          {
             "id":2,
             "columnName":"Column-1-2",
             "rowId":6,
             "operation":"",
             "value":2,
             "operationName":"Operation-1-2",
             "valueName":"Value-1-2"
          },
          {
             "id":3,
             "columnName":"Column-1-3",
             "rowId":8,
             "operation":"",
             "value":"true",
             "operationName":"Operation-1-3",
             "valueName":"Value-1-3"
          },
          {
             "id":4,
             "columnName":"Column-1-4",
             "rowId":3,
             "operation":"Exactly Matching",
             "value":"text",
             "operationName":"Operation-1-4",
             "valueName":"Value-1-4"
          },
          {
             "id":5,
             "columnName":"Column-1-5",
             "rowId":4,
             "operation":"Greater Than",
             "value":"50",
             "operationName":"Operation-1-5",
             "valueName":"Value-1-5"
          },
          {
             "id":6,
             "columnName":"Column-1-6",
             "rowId":9,
             "operation":"",
             "value":17,
             "operationName":"Operation-1-6",
             "valueName":"Value-1-6"
          }
       ]
    }
 ]
}];

var i = 0;
const numberOfUsers = 100;
const numberOfResultsFound = faker.random.number({ min: 1000, max: 10000 });

export default class MockData extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        profile: {
            menu: [
                { index: 0, name: 'Communications', icon: 'Message', path: '/communications', tabs: [
                    { index: 0, name: 'Comm 1', path: '/communications/comm_1' },
                    { index: 1, name: 'Comm 2', path: '/communications/comm_2' },
                    { index: 2, name: 'Comm 3', path: '/communications/comm_3', selected: true },
                    { index: 3, name: 'Comm 4', path: '/communications/comm_4' }],
                },
                { index: 2, name: 'Search', icon: 'YoutubeSearchedFor', path: '/search', tabs: [
                    { index: 0, name: 'Search 1', path: '/search/search_1' },
                    { index: 1, name: 'Search 2', path: '/search/search_2' },
                    { index: 2, name: 'Search 3', path: '/search/search_3', selected: true },
                    { index: 3, name: 'Search 4', path: '/search/search_4' }],
                },
                { index: 1, name: 'Case 1', icon: 'MenuBook', path: '/case_1', selected: true, tabs: [
                    { index: 0, name: 'Case 1', path: '/case_1/case_1' },
                    { index: 1, name: 'Case 2', path: '/case_1/case_2' },
                    { index: 2, name: 'Case 3', path: '/case_1/case_3', selected: true },
                    { index: 3, name: 'Case 4', path: '/case_1/case_4' }],
                },
                { index: 3, name: 'Audit', icon: 'VerifiedUser', path: '/audit', tabs: [
                    { index: 0, name: 'Audit 1', path: '/audit/audit_1' },
                    { index: 1, name: 'Audit 2', path: '/audit/audit_2' },
                    { index: 2, name: 'Audit 3', path: '/audit/audit_3', selected: true },
                    { index: 3, name: 'Audit 4', path: '/audit/audit_4' }],
                },
            ],
        }
      };
    }

    mockSaveKeyTypeData = (tree) => {
        keyTypeData = tree;
        console.log(JSON.stringify(keyTypeData));
    }

    mockKeyTypeData = () => {
        return keyTypeData;
    }

    getTree = (treeNode, keyType, reset) => {
        const numberOfTreeNodesFound = faker.random.number({ min: 1, max: 10 });
        if(reset) {
            tree = [];
        }

        if(!tree.find(t=>t.id === treeNode.id)) {
            tree.push({
                id: treeNode.id, 
                children: new Array(numberOfTreeNodesFound).fill(true).map(() => this.mockNode(treeNode, keyType)),
            })
        }

        const returnedData = tree.find(t=>t.id === treeNode.id);
        const results = {
            data: returnedData,
            numberOfTreeNodesFound,
            source: 'mock'
        }
        return new Promise((resolve, reject) => { 
            resolve(results); 
        });
    }

    mockSaveFilterSet = (filterSet, newFilter) => {
        if(newFilter) {
            filters.push(filterSet);
        }
        else {
            const i = filters.findIndex(f=>f.rowId === filterSet.rowId);
            filters[i] = filterSet;
        }
    }

    mockSavedFilters = () => {
        return filters;
    }

    mockKeyTypes = () => {
        return {
            dataSources: [
                {
                    rowId: 1,
                    abb: "iTechSim",
                    description: "Files",
                    columns: [
                        { rowId: 1, abb: "rowId", description: "ID", datatype: "Long" },
                        { rowId: 2, abb: "dateInserted", description: "Date Inserted", datatype: "DateTime" },
                        { rowId: 3, abb: "summary", description: "Summary", datatype: "String" },
                        { rowId: 4, abb: "duration", description: "Duration", datatype: "Int" },
                        { rowId: 5, abb: "owner", description: "Owner", datatype: "User" },
                        { rowId: 6, abb: "fromAddress", description: "From", datatype: "Identifier" },
                        { rowId: 7, abb: "toAddress", description: "To", datatype: "Identifier" },
                        { rowId: 8, abb: "hasAttachment", description: "Attachment", datatype: "Boolean" },
                        { rowId: 9, abb: "iTechControlFileTypeRowId", description: "File Type", datatype: "Type", types: [
                            { "rowId": 1, "abb": "xls", "description": "Microsoft Excel" }, 
                            { "rowId": 2, "abb": "doc", "description": "Microsoft Word" }, 
                            { "rowId": 3, "abb": "ppt", "description": "Microsoft Powerpoint" }, 
                            { "rowId": 4, "abb": "mpp", "description": "Microsoft Project" }, 
                            { "rowId": 5, "abb": "vdx", "description": "Microsoft Visio Drawing" }, 
                            { "rowId": 6, "abb": "pdf", "description": "Adobe Acrobat" }, 
                            { "rowId": 7, "abb": "txt", "description": "Text Document" }, 
                            { "rowId": 8, "abb": "eml", "description": "Email" }, 
                            { "rowId": 9, "abb": "exe", "description": "Executable" }, 
                            { "rowId": 10, "abb": "aspx", "description": "ASP Page" }, 
                            { "rowId": 11, "abb": "iTechIm", "description": "Instant Message" }, 
                            { "rowId": 12, "abb": "iTechEm", "description": "E-Messenger Meeting" }, 
                            { "rowId": 13, "abb": "iTechSms", "description": "SMS" }, 
                            { "rowId": 14, "abb": "zip", "description": "Zip" }, 
                            { "rowId": 15, "abb": "iTechVCnf", "description": "VideoConf" }, 
                            { "rowId": 16, "abb": "iTechFax", "description": "Fax" }, 
                            { "rowId": 17, "abb": "iTechPrint", "description": "Printer" }, 
                            { "rowId": 18, "abb": "iTechDb", "description": "Database" }, 
                            { "rowId": 19, "abb": "iTechPbx", "description": "PBX Records" }, 
                            { "rowId": 20, "abb": "iTechIdc", "description": "idCard" }, 
                            { "rowId": 21, "abb": "iTechSDoc", "description": "Scanned Document" }, 
                            { "rowId": 22, "abb": "iTechMdSms", "description": "Mobile Data SMS" }, 
                            { "rowId": 23, "abb": "iTechMdEmail", "description": "Mobile Data Email" }, 
                            { "rowId": 24, "abb": "iTechMdPin", "description": "Mobile Data Pin" }, 
                            { "rowId": 25, "abb": "iTechMdCLg", "description": "Mobile Data Call Log" }, 
                            { "rowId": 26, "abb": "iTechMdBl", "description": "Mobile Data Bloomberg" }, 
                            { "rowId": 27, "abb": "iTechMdBm", "description": "Mobile Data Blackberry Messenger" }, 
                            { "rowId": 28, "abb": "iTechMdIm", "description": "Mobile Data Instant Messenger" }, 
                            { "rowId": 29, "abb": "iTechMVce", "description": "Mobile Voice" }, 
                            { "rowId": 30, "abb": "BloomBergIm", "description": "BloombergIm" }, 
                            { "rowId": 31, "abb": "goodChat", "description": "Good Chat" }, 
                            { "rowId": 32, "abb": "goodTalk", "description": "Good Talk" }, 
                            { "rowId": 33, "abb": "iTechSkypeIm", "description": "Skype IM" }, 
                            { "rowId": 34, "abb": "wma", "description": "Windows Media Audio (Skype Voice)" },
                        ]},
                    ]
                },
                {
                    rowId: 2,
                    abb: "iTechAudit",
                    description: "Audit",
                    columns: [
                        { rowId: 14, abb: "rowId", description: "ID", datatype: "Long" },
                        { rowId: 10, abb: "dateInserted", description: "Date Inserted", datatype: "DateTime" },
                        { rowId: 11, abb: "summary", description: "Summary", datatype: "String" },
                        { rowId: 12, abb: "iTechDataSecurityObjectRowId", description: "User", datatype: "SecurityObject" },
                        { rowId: 13, abb: "iTechControlAuditCategoryTypeRowId", description: "Category", datatype: "Type", types: [
                            {"rowId":100000,"abb":"User","description":"All User Activity"},
                            {"rowId":200000,"abb":"Process","description":"All Process Activity"},
                            {"rowId":300000,"abb":"Object","description":"Object"},
                            {"rowId":400000,"abb":"Recovery","description":"Recovery"},
                            {"rowId":500000,"abb":"Policy","description":"Policy"},
                            {"rowId":600000,"abb":"Audit","description":"Audit"},
                            {"rowId":700000,"abb":"System","description":"System"},
                            {"rowId":800000,"abb":"Security","description":"Security"},
                            {"rowId":900000,"abb":"Admin","description":"Administration"},
                            {"rowId":1000000,"abb":"Discovery","description":"Discovery"},
                            {"rowId":1100000,"abb":"Retention","description":"Retention"},
                            {"rowId":1200000,"abb":"LegalHold","description":"Legal Hold"}
                        ]}
                    ]
                },
                {
                    rowId: 3,
                    abb: "iTechDataUser",
                    description: "User",
                    columns: []
                }
            ]
        }
    }

    mockLayout = () => {
        return [0, 1, 2, 3, 4].map(function(i, key, list) {
            return {
              i: i.toString(),
              x: i * 4,
              y: 0,
              w: 4,
              h: 4,
            };
        });
    }

    mockProfile = () => {
        return this.state.profile;
    }

    mockGrid = () => {
        return {
            type: 'grid',
            getData: this.getData,
            sort: [{ column: 'id', desc: true }],
            columns: [
                { key: 'checkbox', description: '', index: 0, minWidth: 30, width: 0.01 },
                { key: 'id', description: 'ID', index: 1, minWidth: 50, width: 0.03, helperText: 'Number' },
                { key: 'type', description: 'TYPE', index: 2, minWidth: 50, width: 0.06, helperText: 'String' },
                { key: 'from', description: 'FROM', index: 3, minWidth: 100, helperText: 'String' },
                { key: 'to', description: 'TO', index: 4, minWidth: 100, helperText: 'String' },
                { key: 'duration', description: 'DURATION', index: 5, minWidth: 80, width: 0.06, helperText: 'HH:mm:ss' },
                { key: 'obDateCreated', description: 'DATE', index: 6, minWidth: 70, width: 0.1, helperText: 'dd/MM/yyyy,HH:mm:ss' },
                { key: 'summary', description: 'SUMMARY', index: 7, helperText: 'String' },
                { key: 'owner', description: 'OWNER', index: 8, helperText: 'String' }
            ]
        }
    }

    apiData = async({ paging = { start: 0, end: 100 } }) => {
        const count = (paging.end - paging.start);
        const data = await fetch(`https://localhost:44390/api/ITechSimSearch/?start=${paging.start}&count=${count}`)
            .then(response => response.json());

        const results = {
            data,
            numberOfResultsFound,
            source: 'api'
        }
        return new Promise((resolve, reject) => { 
            resolve(results); 
        });
    }

    getData = ({ paging = { start: 0, end: 100 } }) => {
        const { start, end } = paging;

        if(data.length < end) {
            const total = (end - start) < (numberOfResultsFound - data.length) ? (end - start) : (numberOfResultsFound - data.length);
            const results = this.mockRows(total);
            data = [...data, ...results];
        }

        const returnedData = data.slice(start, end);
        const results = {
            data: returnedData,
            numberOfResultsFound,
            source: 'mock'
        }
        return new Promise((resolve, reject) => { 
            resolve(results); 
        });
    }

    // TODO: with full API return all results if fewer than X and cache in browser
    getUsers = ({text = '', rowId}) => {
        if(users.length === 0) {
            users = new Array(numberOfUsers).fill(true).map(() => this.mockUser());
        }

        const returnedData = rowId ? [users.find(u=>u.rowId === rowId)] :
            text.length > 0 ? users.filter(u=> u.name.toLowerCase().indexOf(text.toLowerCase()) > -1 || u.identifier.indexOf(text) > -1) : 
            users;

        const results = {
            data: returnedData,
            source: 'mock'
        }
        return new Promise((resolve, reject) => { 
            resolve(results); 
        });
    }

    mockRows = (total = 100) => {
        const list = new Array(total).fill(true).map(() => this.mockRow());
        return list;
    }

    mockNode = (treeNode, keyType) => {
        if(!keyType) {
            return null;
        }

        const nodeType = keyType.abb ? keyType.abb : 'Node';
        const filter = {
            keyTypeRowId: keyType.rowId,
            keyTypeDescription: keyType.description,
            operation: 'EQUALS',
            value: faker.random.number()
        };
        let expressions = [...treeNode.expressions];
        expressions.push({ rule: "AND", filters: [filter]});

        return {
            id: faker.random.number(),
            type: nodeType,
            name: `${keyType.description} ${filter.operation} ${filter.value}`,
            dataSourceRowId: treeNode.dataSourceRowId,
            keyTypeIndex: keyType.index,
            expressions: expressions,
            end: keyType.end,
        };
    }

    mockRow = () => {
        const from = this.mockUser(), 
                to = this.mockUser();

        return {
            id: faker.random.number(),
            type: faker.system.fileType(),
            from: `${from.name} [${from.identifier}]`,
            to: `${to.name} [${to.identifier}]`,
            duration: `0${faker.random.number({min: 0, max: 9 })}:0${faker.random.number({min: 0, max: 9 })}:0${faker.random.number({min: 0, max: 9 })}`,
            obDateCreated: faker.date.past().toLocaleString('en-GB'),
            summary: faker.lorem.sentence(faker.random.number({ min: 4, max: 10 })),
            owner: `${from.name}, ${to.name}`
        };
    }

    mockRowMap = () => {
        const from = this.mockUser(), 
                to = this.mockUser();

        const rows = new Map();
        rows.set('id', faker.random.number());
        rows.set('type', faker.system.fileType());
        rows.set('from', `${from.name} [${from.identifier}]`);
        rows.set('to', `${to.name} [${to.identifier}]`);
        rows.set('duration', `0${faker.random.number({min: 0, max: 9 })}:0${faker.random.number({min: 0, max: 9 })}:0${faker.random.number({min: 0, max: 9 })}`);
        rows.set('obDateCreated', faker.date.past().toLocaleString('en-GB'));
        rows.set('summary', faker.lorem.sentence(faker.random.number({ min: 4, max: 10 })));
        rows.set('owner', `${from.name}, ${to.name}`);
        return rows;
    }

    mockUser = () => ({
        rowId: i++,
        name: faker.name.findName(),
        identifier: `+44${faker.phone.phoneNumberFormat(0).replace(/-/g, '')}`
    })
}