import { useState, useEffect, useCallback } from "react";

type CopyStatus = 'Copy' | 'Copied' | 'Failed'

const useCopyToClipboard = (
  text: string,
  notifyTimeout = 2500,
): [CopyStatus, () => void] => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('Copy')
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus('Copied'),
      () => setCopyStatus('Failed'),
    )
  }, [text])

  useEffect(() => {
    if (copyStatus === 'Copy') {
      return
    }

    const timeoutId = setTimeout(() => setCopyStatus('Copy'), notifyTimeout)

    return () => clearTimeout(timeoutId)
  }, [copyStatus])

  return [copyStatus, copy]
}

export default useCopyToClipboard;