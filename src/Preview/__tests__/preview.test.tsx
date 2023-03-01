import React from 'react'
import { act } from 'react-dom/test-utils'
import Preview from '../Preview'
import { screen } from '@testing-library/react'
import { PageDataType, StoreContextState } from '../../_context/types/StoreContextState'
import InitialState from '../../_context/types/initialState'
import { useSelectors } from '../../_context/selectors/useSelectors'
import { StoreContext } from '../../_context/Store'
import { TextResponse } from '../../Model/iTechRestApi/TextResponse'
import { fsiService } from '../../_services/fsiService'
import { dataService } from '../../_services/dataService'
import SelectedGridRowType from '../../Model/Types/selectedGridRowType'
import { ITechDataWebMenuExtended } from '../../Model/Extended/ITechDataWebMenuExtended'
import { Attachment } from '../../Model/iTechRestApi/Attachment'
//import {transcriptService} from "../../_services/transcriptService"
import { render } from '../../Test.helpers/test-utils' // custom render that wraps with themeprovider
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material/styles'
import { glLightTheme } from '../../_theme/glLightTheme'

let mockFsi: typeof fsiService
let mockDataService: typeof dataService

// called from mediaPlayer / transcript component
jest.mock('../../_services/transcriptService', () => ({
  transcriptService: {
    get: () => {
      return Promise.resolve({ text: 'hi' })
    },
  },
}))

describe('<Preview/> component', () => {
  beforeEach(() => {
    mockFsi = {
      download: jest.fn(() => ''),
      downloadPdf: jest.fn(() => ''),
      text: jest.fn(() => Promise.resolve({ text: 'xxx' } as TextResponse)),
      audio: jest.fn(() => ''),
      email: jest.fn(() => 'emailPath'),
      emailAttachments: jest.fn(() =>
        Promise.resolve([{ filename: 'file1.pdf' }, { filename: 'file2.pdf' }] as Attachment[]),
      ),
      getAttachment: jest.fn(() => Promise.resolve({} as Blob)),
      pdf: jest.fn(() => ''),
      properties: jest.fn(() => ''),
      downloadProperties: jest.fn(() => ''),
      getAttachmentLink2: jest.fn(() => ''),
    }
    mockDataService = {
      gid: jest.fn(() => Promise.resolve({})),
      query: jest.fn(() => Promise.resolve([])),
      convertDurationExpression: jest.fn(() => []),
      updateStatus: jest.fn(() => Promise.resolve()),
      reference: jest.fn(() => Promise.resolve()),
      fileExport: jest.fn(() => Promise.resolve()),
      queryCount: jest.fn(() => Promise.resolve(0)),
    }
  })

  it('renders the preview component as waiting', async () => {
    const pageData: any[] = []
    let container: HTMLElement | null = null

    container = render(
      <Preview data={pageData} fsiService={mockFsi} dataService={mockDataService} area='area' />,
    ).container

    expect(container.querySelector('div.MuiCardHeader-content')).toBeTruthy()
  })

  it('renders the preview text', async () => {
    const selected = {
      rowId: 1,
      fsiGuid: { GuidString: '' },
      fileTypeAbb: 'WhatsAppIm',
      fileTypeDescription: 'title',
    }
    const pageData: any[] = []

    const selectedTabId = 1
    const testState: StoreContextState = {
      ...InitialState,
      ...{
        menuList: [
          {
            selected: true,
            rowId: 1,
            iTechDataWebTabs: [{ selected: true, rowId: selectedTabId }],
          },
        ] as ITechDataWebMenuExtended[],
      },
    }

    testState.pageData?.set(selectedTabId, {
      ...testState.pageData?.get(selectedTabId),
      data: selected,
      selectedVersion: undefined,
    } as PageDataType)

    const selectors = useSelectors(testState)

    await act(async () => {
      render(
        <StoreContext.Provider value={{ state: testState, selectors, dispatch: jest.fn }}>
          <Preview data={pageData} fsiService={mockFsi} dataService={mockDataService} area='area' />
        </StoreContext.Provider>,
      )
    })

    const title = await screen.findByText('title')
    expect(title).toBeTruthy()
  })

  it('renders the preview audio mediaplayer', async () => {
    const pageData = {
      rowId: 1,
      fsiGuid: { GuidString: 'test' },
      fileTypeAbb: 'wma',
      fileTypeDescription: 'title',
    }

    const selectedTabId = 1
    const testState: StoreContextState = {
      ...InitialState,
      ...{
        menuList: [
          {
            selected: true,
            rowId: 1,
            iTechDataWebTabs: [{ selected: true, rowId: selectedTabId }],
          },
        ] as ITechDataWebMenuExtended[],
      },
    }

    testState.pageData?.set(selectedTabId, {
      ...testState.pageData?.get(selectedTabId),
      data: pageData,
      selectedVersion: undefined,
    } as PageDataType)

    const selectors = useSelectors(testState)

    await act(async () => {
      render(
        <StoreContext.Provider value={{ state: testState, selectors, dispatch: jest.fn }}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={glLightTheme}>
              <Preview data={[]} fsiService={mockFsi} dataService={mockDataService} area='area' />
            </ThemeProvider>
          </StyledEngineProvider>
        </StoreContext.Provider>,
      )
    })

    const input = await screen.findByTestId('waveform-', { exact: false })

    expect(input).toBeTruthy()
  })

  it('renders the preview email', async () => {
    const pageData = {
      rowId: 1,
      fsiGuid: { GuidString: 'test' },
      fileTypeAbb: 'eml',
      fileTypeDescription: 'email title',
      fromAddress: 'from@x.y.com',
      toAddesss: 'to@a.b.com',
      summary: 'email subject',
    }

    mockDataService.gid = jest.fn(() => Promise.resolve(pageData))

    const selectedTabId = 1
    const testState: StoreContextState = {
      ...InitialState,
      ...{
        menuList: [
          {
            selected: true,
            rowId: 1,
            iTechDataWebTabs: [{ selected: true, rowId: selectedTabId }],
          },
        ] as ITechDataWebMenuExtended[],
      },
    }

    testState.pageData?.set(selectedTabId, {
      ...testState.pageData?.get(selectedTabId),
      data: pageData as unknown as SelectedGridRowType,
      selectedVersion: undefined,
    } as PageDataType)

    const selectors = useSelectors(testState)

    await act(async () => {
      render(
        <StoreContext.Provider value={{ state: testState, selectors, dispatch: jest.fn }}>
          <Preview data={[]} fsiService={mockFsi} dataService={mockDataService} area='area' />
        </StoreContext.Provider>,
      )
    })
    // 'summaryInput' is a div wrapper around the input
    const input = await (await screen.findByTestId('summaryInput')).firstChild

    // extended testing-library functions..
    expect(input).toHaveValue(pageData.summary)
  })
})
