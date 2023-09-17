"use client"
import { IconGripVertical } from "@tabler/icons-react"
import { useListState } from "@mantine/hooks"
import { animated, useSprings, config } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import { clamp } from "lodash"

const data = "Lorem ipsum dor Test Test2".split(" ")

const fn =
  (active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) => {
    return active && index === originalIndex
      ? {
          y,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "zIndex",
          config: (key: string) =>
            key === "y" ? config.stiff : config.default,
        }
      : {
          zIndex: 0,
          shadow: 1,
          immediate: false,
          y:
            index > originalIndex && index <= curIndex
              ? -64
              : index < originalIndex && index >= curIndex
              ? 64
              : 0,
        }
  }
export default function Home() {
  const [list, handlers] = useListState(data)
  const [springs, api] = useSprings(data.length, fn())
  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    const curRow = clamp(
      Math.round((originalIndex * 56 + y) / 56),
      0,
      data.length - 1
    )
    api.start(fn(active, originalIndex, curRow, y))
    if (!active) {
      handlers.reorder({ from: originalIndex, to: curRow })
      api.start({ zIndex: 0, shadow: 1, immediate: true, y: 0 })
    }
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-red-900 flex gap-2 p-2 flex-col">
        {springs.map(({ zIndex, shadow, y }, i) => (
          <animated.div
            key={i}
            className="w-96 bg-green-950 p-2"
            style={{
              zIndex,
              boxShadow: shadow.to(
                (s: number) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
              ),
              y,
            }}
            children={
              <div className="flex gap-2 justify-between">
                {list[i]}
                <div
                  className="bg-yellow-950 p-2 cursor-pointer touch-none"
                  {...bind(i)}
                >
                  <IconGripVertical />
                </div>
              </div>
            }
          />
        ))}
      </div>
    </main>
  )
}
