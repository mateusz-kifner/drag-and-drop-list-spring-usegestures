"use client"
import { IconGripVertical } from "@tabler/icons-react"
import { useListState } from "@mantine/hooks"
import { animated, useSprings, config } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import { useRef } from "react"
import { clamp } from "lodash"
// import swap from "lodash-move"

const data = Array.from({ length: 20 }).map((val, index) => "Text " + index)

const fn =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 100 + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "zIndex",
          config: (key: string) =>
            key === "y" ? config.stiff : config.default,
        }
      : {
          y: order.indexOf(index) * 100,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        }

export default function Home() {
  const [list, handlers] = useListState(data)
  const order = useRef(data.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  const [springs, api] = useSprings(data.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(
      Math.round((curIndex * 100 + y) / 100),
      0,
      data.length - 1
    )
    // const newOrder = swap(order.current, curIndex, curRow)
    // api.start(fn(newOrder, active, originalIndex, curIndex, y)) // Feed springs new style data, they'll animate the view without causing a single render
    // if (!active) order.current = newOrder
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-red-900 flex gap-2 p-2 flex-col">
        {springs.map(({ zIndex, shadow, y, scale }, i) => (
          <animated.div
            {...bind(i)}
            key={i}
            style={{
              zIndex,
              boxShadow: shadow.to(
                (s: number) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
              ),
              y,
              scale,
            }}
            children={
              <div className="w-96 h-10 bg-green-950 p-2">{list[i]}</div>
            }
          />
        ))}
      </div>
    </main>
  )
}
