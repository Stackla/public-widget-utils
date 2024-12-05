import { SdkSwiper, SwiperData, SwiperProps } from "../../../types/SdkSwiper"
import Swiper from "swiper"
import { Keyboard, Manipulation, Mousewheel, Navigation } from "swiper/modules"

const swiperContainer: SdkSwiper = {}

export type LookupAttr = {
  name: string
  value: string
}

export function initializeSwiper({
  id,
  widgetSelector,
  prevButton = "swiper-button-prev",
  nextButton = "swiper-button-next",
  paramsOverrides
}: SwiperProps) {
  const prev = widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${prevButton}`)
  const next = widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${nextButton}`)

  if (!swiperContainer[id]) {
    swiperContainer[id] = {} as SwiperData
  }

  const swiperInstance = swiperContainer[id]?.instance

  if (swiperInstance) {
    if (!swiperInstance.params?.enabled) {
      enableSwiper(id)
      return
    }
    // re-initialize
    swiperInstance.destroy(true)
  } else {
    swiperContainer[id] = { pageIndex: 1 }
  }

  swiperContainer[id]!.instance = new Swiper(widgetSelector, {
    modules: [Navigation, Manipulation, Keyboard, Mousewheel],
    spaceBetween: 10,
    observer: true,
    grabCursor: true,
    allowTouchMove: true,
    direction: "horizontal",
    watchSlidesProgress: true,
    normalizeSlideIndex: true,
    watchOverflow: true,
    mousewheel: {
      enabled: false
    },
    navigation: {
      enabled: !!(prev && next),
      nextEl: next,
      prevEl: prev
    },
    resizeObserver: true,
    ...paramsOverrides
  })
}

export function refreshSwiper(id: string) {
  if (swiperContainer[id]?.instance) {
    swiperContainer[id].instance.update()
  }
}

export function getSwiperIndexforTile(swiperSelector: HTMLElement, tileId: string, lookupAttr?: LookupAttr) {
  const slideElements = swiperSelector.querySelectorAll<HTMLElement>(".swiper-slide")
  const index = (() => {
    if (lookupAttr) {
      return Array.from(slideElements).findIndex(
        element =>
          element.getAttribute("data-id") === tileId && element.getAttribute(lookupAttr.name) === lookupAttr.value
      )
    }
    return Array.from(slideElements).findIndex(element => element.getAttribute("data-id") === tileId)
  })()
  return index < 0 ? 0 : index
}

export function disableSwiper(id: string) {
  swiperContainer[id]?.instance?.disable()
}

export function enableSwiper(id: string) {
  swiperContainer[id]?.instance?.enable()
}

export function destroySwiper(id: string) {
  if (swiperContainer[id]?.instance) {
    swiperContainer[id].instance.destroy(true, true)
    delete swiperContainer[id]
  }
}

export function getClickedIndex(id: string) {
  if (swiperContainer[id]?.instance) {
    const clickedSlide = swiperContainer[id].instance.clickedSlide
    const indexFromAttribute = clickedSlide.getAttribute("data-swiper-slide-index")
    return indexFromAttribute && !Number.isNaN(parseInt(indexFromAttribute))
      ? parseInt(indexFromAttribute)
      : swiperContainer[id].instance.clickedIndex
  }
  return 0
}

export function getInstance(id: string) {
  return swiperContainer[id]?.instance
}

export function getActiveSlide(id: string) {
  return swiperContainer[id]?.instance?.realIndex || 0
}

export function getActiveSlideElement(id: string) {
  return swiperContainer[id]?.instance?.slides[getActiveSlide(id) || 0]
}

export function isSwiperLoading(id: string) {
  if (swiperContainer[id] && swiperContainer[id].instance) {
    return swiperContainer[id].isLoading
  }
  return false
}

export function setSwiperLoadingStatus(id: string, isLoading: boolean) {
  if (swiperContainer[id] && swiperContainer[id].instance) {
    swiperContainer[id].isLoading = isLoading
  }
}

export function updateSwiperInstance(id: string, updateProps: (swiperData: SwiperData) => void) {
  if (swiperContainer[id] && swiperContainer[id].instance) {
    updateProps(swiperContainer[id])
  }
}
