'use client'

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Tab as TabUi } from '@headlessui/react'
import clsx from 'clsx'
import { create } from 'zustand'

import { Tag } from '@/mdx/components/Tag'

const languageNames = {
  go: 'Go',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  php: 'PHP',
  python: 'Python',
  ts: 'TypeScript',
  ruby: 'Ruby',
  typescript: 'TypeScript',
  yaml: 'YAML',
}

export const getPanelTitle = function getPanelTitle({ title, language }) {
  return title ?? languageNames[language] ?? language ?? 'No title'
}

function ClipboardIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        strokeWidth="0"
        d="M5.5 13.5v-5a2 2 0 0 1 2-2l.447-.894A2 2 0 0 1 9.737 4.5h.527a2 2 0 0 1 1.789 1.106l.447.894a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2Z"
      />
      <path
        fill="none"
        strokeLinejoin="round"
        d="M12.5 6.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2m5 0-.447-.894a2 2 0 0 0-1.79-1.106h-.527a2 2 0 0 0-1.789 1.106L7.5 6.5m5 0-1 1h-3l-1-1"
      />
    </svg>
  )
}

function CopyButton({ code }) {
  let [copyCount, setCopyCount] = useState(0)
  let copied = copyCount > 0
  useEffect(() => {
    if (copyCount > 0) {
      let timeout = setTimeout(() => setCopyCount(0), 1000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [copyCount])
  return (
    <button
      type="button"
      className={clsx(
        'group/button absolute top-3.5 right-4 overflow-hidden rounded-full py-1 pl-2 pr-3 text-2xs font-medium opacity-0 backdrop-blur-sm transition focus:opacity-100 group-hover:opacity-100',
        copied
          ? 'bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/20'
          : 'bg-white/5 hover:bg-white/7.5 dark:bg-white/2.5 dark:hover:bg-white/5'
      )}
      onClick={() => {
        window.navigator.clipboard.writeText(code).then(() => {
          setCopyCount((count) => count + 1)
        })
      }}
    >
      <span
        aria-hidden={copied}
        className={clsx(
          'pointer-events-none flex items-center gap-0.5 text-zinc-400 transition duration-300',
          copied && '-translate-y-1.5 opacity-0'
        )}
      >
        <ClipboardIcon className="h-5 w-5 fill-zinc-500/20 stroke-zinc-500 transition-colors group-hover/button:stroke-zinc-400" />
        Copy
      </span>
      <span
        aria-hidden={!copied}
        className={clsx(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-emerald-400 transition duration-300',
          !copied && 'translate-y-1.5 opacity-0'
        )}
      >
        Copied!
      </span>
    </button>
  )
}

export const TabPanelHeader = function TabPanelHeader({ tag, label }) {
  if (!tag && !label) {
    return null
  }
  return (
    <div className="flex h-9 items-center gap-2 border-y border-t-transparent border-b-white/7.5 bg-zinc-900 bg-white/2.5 px-4 dark:border-b-white/5 dark:bg-white/1">
      {tag && (
        <div className="dark flex">
          <Tag variant="small">{tag}</Tag>
        </div>
      )}
      {tag && label && (
        <span className="h-0.5 w-0.5 rounded-full bg-zinc-500" />
      )}
      {label && (
        <span className="font-mono text-sm text-zinc-400">{label}</span>
      )}
    </div>
  )
}

function TabPanel({ tag, label, code, children }) {
  let child = Children.only(children)
  return (
    <div className="group dark:bg-white/2.5">
      <TabPanelHeader
        tag={child.props.tag ?? tag}
        label={child.props.label ?? label}
      />
      <div className="relative">
        { (child.props.code || code)
          ? <>
              <pre className="overflow-x-auto p-4 text-sm/8 text-white">{children}</pre>
              <CopyButton code={child.props.code ?? code} />
            </>
          : <div className="overflow-x-auto p-4 text-sm/8 text-white">{children}</div>
        }
      </div>
    </div>
  )
}

export const TabsHeader = function TabsHeader({ title, children, selectedIndex }) {
  let hasTabs = Children.count(children) > 1
  if (!title && !hasTabs) {
    return null
  }
  return (
    <div className="flex min-h-[calc(--spacing(12)+1px)] flex-wrap items-start gap-x-4 border-b border-zinc-700 bg-zinc-800 px-4 dark:border-zinc-800 dark:bg-transparent">
      {title && (
        <h3 className="mr-auto pt-3 text-sm font-semibold text-white">
          {title}
        </h3>
      )}
      {hasTabs && (
        <TabUi.List className="-mb-px flex gap-4 text-sm font-medium">
          {Children.map(children, (child, childIndex) => (
            <TabUi
              className={clsx(
                'border-b py-3 transition focus:not-focus-visible:outline-hidden',
                childIndex === selectedIndex
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-300'
              )}
            >
              {getPanelTitle(child.props)}
            </TabUi>
          ))}
        </TabUi.List>
      )}
    </div>
  )
}

function TabsPanels({ children, ...props }) {
  let hasTabs = Children.count(children) > 1
  if (hasTabs) {
    return (
      <TabUi.Panels>
        {Children.map(children, (child) => (
          <TabUi.Panel>
            <TabPanel {...props}>{child}</TabPanel>
          </TabUi.Panel>
        ))}
      </TabUi.Panels>
    )
  }
  return <TabPanel {...props}>{children}</TabPanel>
}

function usePreventLayoutShift() {
  let positionRef = useRef()
  let rafRef = useRef()
  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(rafRef.current)
    }
  }, [])
  return {
    positionRef,
    preventLayoutShift(callback) {
      let initialTop = positionRef.current.getBoundingClientRect().top
      callback()
      rafRef.current = window.requestAnimationFrame(() => {
        let newTop = positionRef.current.getBoundingClientRect().top
        window.scrollBy(0, newTop - initialTop)
      })
    },
  }
}

const usePreferredLanguageStore = create((set) => ({
  preferredLanguages: [],
  addPreferredLanguage: (language) =>
    set((state) => ({
      preferredLanguages: [
        ...state.preferredLanguages.filter(
          (preferredLanguage) => preferredLanguage !== language
        ),
        language,
      ],
    })),
}))

function useTabGroupProps(availableLanguages) {
  let { preferredLanguages, addPreferredLanguage } = usePreferredLanguageStore()
  let [selectedIndex, setSelectedIndex] = useState(0)
  let activeLanguage = [...availableLanguages].sort(
    (a, z) => preferredLanguages.indexOf(z) - preferredLanguages.indexOf(a)
  )[0]
  let languageIndex = availableLanguages.indexOf(activeLanguage)
  let newSelectedIndex = languageIndex === -1 ? selectedIndex : languageIndex
  if (newSelectedIndex !== selectedIndex) {
    setSelectedIndex(newSelectedIndex)
  }
  let { positionRef, preventLayoutShift } = usePreventLayoutShift()
  return {
    as: 'div',
    ref: positionRef,
    selectedIndex,
    onChange: (newSelectedIndex) => {
      preventLayoutShift(() =>
        addPreferredLanguage(availableLanguages[newSelectedIndex])
      )
    },
  }
}

export const TabsContext = createContext(false)

export function Tabs({ children, title, ...props }) {
  let languages = Children.map(children, (child) => getPanelTitle(child.props))
  let tabGroupProps = useTabGroupProps(languages)
  let hasTabs = Children.count(children) > 1
  let Container = hasTabs ? TabUi.Group : 'div'
  let containerProps = hasTabs ? tabGroupProps : {}
  let headerProps = hasTabs
    ? { selectedIndex: tabGroupProps.selectedIndex }
    : {}
  return (
    <TabsContext.Provider value={true}>
      <Container
        {...containerProps}
        className="not-prose my-6 overflow-hidden rounded-2xl bg-zinc-900 shadow-md dark:ring-1 dark:ring-white/10"
      >
        <TabsHeader title={title} {...headerProps}>
          {children}
        </TabsHeader>
        <TabsPanels {...props}>{children}</TabsPanels>
      </Container>
    </TabsContext.Provider>
  )
}
