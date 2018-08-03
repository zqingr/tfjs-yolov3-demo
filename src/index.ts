import yolov3, { preload } from 'tfjs-yolov3'
import fetchInterceptor from './fetch-interceptor'

import './style.css'

const getPercentage = (num: number) => Math.round(num * 10000) / 100 + '%'

const $progress = document.getElementById('progress') as HTMLImageElement
fetchInterceptor((percent: number) => {
  $progress.innerHTML = getPercentage(percent)
})

const $img = document.getElementById('img') as HTMLImageElement
const $body = document.body
const $rectbox = document.getElementById('rect-box') as HTMLElement

async function start () {
  // const boxes = await yolov3({ $img, modelUrl: '/model/yolov3/model.json' })
  await preload()
  $body.className = 'loaded'

  const $lis = Array.from(document.querySelectorAll('.examples li')) as HTMLElement[]
  $lis.forEach(($li: HTMLElement) => {
    $li.addEventListener('click', () => {
      const $liImg = $li.querySelector('img') as HTMLImageElement
      $img.src = $liImg.src
      $lis.forEach($li => { $li.className = '' })
      $li.className = 'active'

      $rectbox.innerHTML = ''

      $img.onload = () => {
        setTimeout(() => {
          yolo($img)
        })
      }
    })
  })

  $lis[0].click()

  const $file = document.getElementById('file') as HTMLInputElement
  $file.addEventListener('change', (events: any) => {
    const imgFile = events.target.files[0]

    $img.src = window.URL.createObjectURL(imgFile)
    $lis.forEach($li => { $li.className = '' })

    $rectbox.innerHTML = ''

    $img.onload = () => {
      setTimeout(() => {
        yolo($img)
      })
    }
  })
}

async function yolo ($img: HTMLImageElement) {
  const boxes = await yolov3({ $img })

  $rectbox.innerHTML = ''

  boxes.forEach(box => {
    const $div = document.createElement('div')
    $div.className = 'rect'
    $div.style.top = box.top + 'px'
    $div.style.left = (box.left + $img.offsetLeft) + 'px'
    $div.style.width = box.width + 'px'
    $div.style.height = box.height + 'px'
    $div.innerHTML = `<span class='className'>${box.classes} ${getPercentage(box.scores)}</span>`

    $rectbox.appendChild($div)
  })

  console.log(boxes)
}

start()
