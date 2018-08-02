
export default function fetchInterceptor (callBack: Function) {
  const _fetch = window.fetch
  const totalModel = 191
  let currentDownload = 0

  window.fetch = function (url: string) {
    if (!/group\d+-shard/.test(url)) {
      return _fetch.apply(window, arguments)
    }

    const modeGroup = {
      url,
      isDone: false
    }
    return _fetch.apply(window, arguments).then((res: any) => {
      modeGroup.isDone = true
      currentDownload++

      callBack(currentDownload / totalModel)

      return res
    })
  }
}
