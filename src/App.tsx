import { useCallback, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const MIN_HEIGHT = 33;
const MAX_HEIGHT = 148;
const HEIGHT_DIFF = MAX_HEIGHT - MIN_HEIGHT;

const flexCenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function App() {
  const isFirstPage = document.location.href.includes('isFirstPage')
  const [opacity, setOpacity] = useState(isFirstPage ? 1 : 0);
  const [expandedY, setExpandedY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(isFirstPage ? MAX_HEIGHT : MIN_HEIGHT);
  const [scrollPos, setScrollPos] = useState(0);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [isCalcBloked, setIsCalcBlocked] = useState(false);

  const [isSmallView, setIsSmallView] = useState(false);

  // useEffect(() => {
  //   if (isSmallView) {
  //     setIsCalcBlocked(true);
  //     setHeaderHeight(33);
  //     return;
  //   }
  //   setIsCalcBlocked(false);
  //   setHeaderHeight(isHeaderExpanded ? 148 : 33);
  // }, [isSmallView])

  const changeScrollPos = () => {
    setScrollPos(window.pageYOffset);
  }

  useEffect(() => {
    console.log({
      isSmallView,
      isHeaderExpanded
    })
    if (isFirstPage) {
      if (isSmallView && isHeaderExpanded) {
        setIsCalcBlocked(true);
        setHeaderHeight(33);
        setOpacity(0)
        return;
      } else {
        setIsCalcBlocked(false);
        setHeaderHeight(isHeaderExpanded ? MAX_HEIGHT : MIN_HEIGHT);
        setOpacity(Number(isHeaderExpanded));
      }
    }
    changeHeaderHeight();
  }, [scrollPos, expandedY, opacity, headerHeight, isSmallView, isHeaderExpanded, isFirstPage])

  const changeHeaderHeight = () => {
    const offset = window.pageYOffset;
    if (isFirstPage) {
      const calcPoint = offset - expandedY < 0 ? 0 : offset - expandedY;
      const newHeight = MAX_HEIGHT - calcPoint;
      const newOpacity = (HEIGHT_DIFF - calcPoint) / HEIGHT_DIFF;
      if (newOpacity <= 0) {
        setExpandedY(0)
        setHeaderHeight(MIN_HEIGHT)
        setIsHeaderExpanded(false);
      } else {
        setExpandedY(expandedY > offset ? offset : expandedY);
        setHeaderHeight(newHeight)
        if (newHeight === MAX_HEIGHT) {
          setIsHeaderExpanded(true);
        }
      }
      setOpacity(newOpacity)
    } else {
      if (isHeaderExpanded && !isCalcBloked) {
        const calcPoint = offset - expandedY < 0 ? 0 : offset - expandedY;
        const newHeight = MAX_HEIGHT - calcPoint;
        const newOpacity = (HEIGHT_DIFF - calcPoint) / HEIGHT_DIFF;
        if (newOpacity <= 0) {
          setExpandedY(0);
          setHeaderHeight(MIN_HEIGHT);
          setIsHeaderExpanded(false);
        } else {
          setExpandedY(expandedY > offset ? offset : expandedY);
          setHeaderHeight(newHeight)
        }
        setOpacity(newOpacity)
      }
    }
  };

  const expandHeaderWithAnimation = (callback: () => void) => {
    let timer = setInterval(({setOpacity, setHeaderHeight, callback}) => {
      let stop = false;
      if (stop) clearInterval(timer);
      else {
        window.scrollTo(0, window.pageYOffset - 115 / 1000 * 20);
        setHeaderHeight((prev: number) => { 
          let res = prev + 115 / 1000 * 20;
          if (res >= MAX_HEIGHT) {
            clearInterval(timer)
            callback();
            return MAX_HEIGHT
          }
          return res;
        });
        setOpacity((prev: number) => prev + 1 / 1000 * 20)
      }
    }, 2, {setOpacity, setHeaderHeight, callback});
}

  const handleExpandY = () => {
    if (isCalcBloked) return;
    const offset = window.pageYOffset;
    if (isFirstPage) {
      setIsHeaderExpanded(true)
      if (offset < MAX_HEIGHT) {
        window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      } else {
        setExpandedY(offset - HEIGHT_DIFF + 1);
        window.scrollTo({
          top: offset - HEIGHT_DIFF,
          behavior: 'smooth'
        })
      }
    } else {
      setIsHeaderExpanded(true)
      setExpandedY(offset);
      setIsCalcBlocked(true)
      expandHeaderWithAnimation(() => {
        setIsCalcBlocked(false)
      })
    }
  }

  const handleSmallView = () => {
      setIsSmallView(true)
  }

  const handleExpand = () => {
    setIsSmallView(false)
  }

  const backgroundColor = 'black';

  useEffect(() => {
    window.addEventListener('scroll', changeScrollPos, {passive: true});
    return () => window.removeEventListener('scroll', changeScrollPos)
  })
  return (
    <div style={{width: '100%', height: '100%'}}>
      <div id="headerWrapper"
           style={{
            height: isFirstPage || isHeaderExpanded ? MAX_HEIGHT : headerHeight,
            background: backgroundColor,
            width: '100%',
            }}>
        <div id="header" style={{width: '100%', position: 'fixed', top: 0, background: backgroundColor}}>
          <div 
            style={{
              height: MIN_HEIGHT,
              top: headerHeight - MIN_HEIGHT,
              position: 'absolute',
              width: '100%',
              opacity: 1 - opacity,
              zIndex: 1000,
              ...flexCenter,
              display: opacity === 1 ? 'none' : 'flex',
            }}
            onClick={handleExpandY}>
              sticky part
          </div>
          <div style={{
              height: headerHeight,
              background: backgroundColor,
              width: '100%',
              top: 0,
              position: 'absolute',
              zIndex: 999,
              opacity: 1 - opacity,
          }}/>
          <div style={{
            width: '100%',
            height: headerHeight,
            background: backgroundColor,
            top: 0,
            position: 'absolute',
          }}>
            <div
            style={{
              height: headerHeight,
              background: backgroundColor,
              width: '100%',
              top: 0,
              position: 'absolute',
              transform: `scale(${0.7 + (headerHeight/MAX_HEIGHT)*0.3})`,
              ...flexCenter,
              // opacity,
              // transition: !isHeaderExpanded ? undefined : '1s'
            }}
            >
              main part
          </div>
          </div>
        </div>
      </div>
      <div style={{height: '300vh', background: 'lightgray'}}>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div onClick={handleExpand}>handleExpand</div>
        <div onClick={handleSmallView}>handleSmallView</div>
      </div>
    </div>
  )
}

export default App
