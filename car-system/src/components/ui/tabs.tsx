// src/components/ui/tabs.tsx
"use client"

import React, { createContext, useContext, useState } from 'react'

interface TabsContextType {
    value: string
    onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export const Tabs: React.FC<{
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode
}> = ({ defaultValue, value, onValueChange, children }) => {
    const [internalValue, setInternalValue] = useState(defaultValue)

    const contextValue: TabsContextType = {
        value: value !== undefined ? value : internalValue,
        onValueChange: onValueChange || setInternalValue
    }

    return (
        <TabsContext.Provider value={contextValue}>
            <div className="w-full">{children}</div>
        </TabsContext.Provider>
    )
}

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                          children,
                                                                                          className = ""
                                                                                      }) => {
    return (
        <div className={`flex items-center justify-start border-b border-gray-200 ${className}`}>
            {children}
        </div>
    )
}

export const TabsTrigger: React.FC<{
    value: string;
    children: React.ReactNode;
    className?: string;
}> = ({ value, children, className = "" }) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabsTrigger must be used within Tabs')

    const isActive = context.value === value

    return (
        <button
            onClick={() => context.onValueChange(value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ${className}`}
        >
            {children}
        </button>
    )
}

export const TabsContent: React.FC<{
    value: string;
    children: React.ReactNode;
    className?: string;
}> = ({ value, children, className = "" }) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabsContent must be used within Tabs')

    if (context.value !== value) return null

    return <div className={className}>{children}</div>
}