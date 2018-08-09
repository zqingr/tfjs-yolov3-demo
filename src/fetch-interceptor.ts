
export default function fetchInterceptor (totalCount: number, callBack: Function) {
  const _fetch = window.fetch
  const totalModel = totalCount * 2
  const promiseAllIndex = 1
  let currentPromiseAllIndex = 0
  let currentDownload = 0

  // window.fetch = function (url: string) {
  //   if (!/group\d+-shard/.test(url)) {
  //     return _fetch.apply(window, arguments)
  //   }

  //   const modeGroup = {
  //     url,
  //     isDone: false
  //   }
  //   return _fetch.apply(window, arguments).then((res: any) => {
  //     // modeGroup.isDone = true
  //     // currentDownload++

  //     // callBack(currentDownload / totalModel)

  //     return res
  //   })
  // }

  const PromiseAll = Promise.all.bind(Promise)
  Promise.all = function (reqs: Promise<any>[]) {
    if (reqs.length === totalModel / 2 && currentPromiseAllIndex++ <= promiseAllIndex) {
      const modeGroup = {
        isDone: false
      }
      reqs.forEach(req => {
        req.then(r => {
          modeGroup.isDone = true
          currentDownload++
          callBack(currentDownload / totalModel)
        }).catch(e => {
          // window.location.reload()
        })
      })
    }
    return PromiseAll.apply(window, arguments)
  }
}
