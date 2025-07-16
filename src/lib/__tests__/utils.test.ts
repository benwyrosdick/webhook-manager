import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500')
    })

    it('should handle conditional classes', () => {
      expect(cn('px-2 py-1', true && 'bg-red-500')).toBe('px-2 py-1 bg-red-500')
      expect(cn('px-2 py-1', false && 'bg-red-500')).toBe('px-2 py-1')
    })

    it('should handle undefined and null values', () => {
      expect(cn('px-2 py-1', undefined, null)).toBe('px-2 py-1')
    })

    it('should handle empty strings', () => {
      expect(cn('px-2 py-1', '', 'bg-red-500')).toBe('px-2 py-1 bg-red-500')
    })

    it('should handle conflicting Tailwind classes', () => {
      // This test assumes tailwind-merge is properly configured
      // It should keep the last conflicting class
      expect(cn('px-2 px-4', 'py-1 py-2')).toBe('px-4 py-2')
    })

    it('should handle array of classes', () => {
      expect(cn(['px-2', 'py-1'], 'bg-red-500')).toBe('px-2 py-1 bg-red-500')
    })

    it('should handle object syntax', () => {
      expect(cn({
        'px-2': true,
        'py-1': true,
        'bg-red-500': false
      })).toBe('px-2 py-1')
    })

    it('should handle complex combinations', () => {
      const isActive = true
      const hasError = false
      
      expect(cn(
        'base-class',
        isActive && 'active-class',
        hasError && 'error-class',
        'final-class'
      )).toBe('base-class active-class final-class')
    })
  })
})