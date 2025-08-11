import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { 
  CollectionManager, 
  SafeCollectionImpl, 
  collectionManager,
  safeCollectionUtils 
} from '../SafeCollection'
import { errorReportingService } from '@/services/ErrorReportingService'

// Mock the error reporting service
vi.mock('@/services/ErrorReportingService', () => ({
  errorReportingService: {
    reportError: vi.fn(),
    reportHandledError: vi.fn(),
  },
}))

describe('SafeCollectionImpl', () => {
  let collection: SafeCollectionImpl<string>

  beforeEach(() => {
    vi.clearAllMocks()
    collection = new SafeCollectionImpl<string>([], 'TestCollection')
  })

  describe('constructor', () => {
    it('creates empty collection by default', () => {
      const emptyCollection = new SafeCollectionImpl<string>()
      expect(emptyCollection.isEmpty()).toBe(true)
      expect(emptyCollection.size()).toBe(0)
    })

    it('creates collection with initial items', () => {
      const items = ['item1', 'item2', 'item3']
      const collectionWithItems = new SafeCollectionImpl<string>(items)
      
      expect(collectionWithItems.size()).toBe(3)
      expect(collectionWithItems.toArray()).toEqual(items)
    })

    it('handles invalid initial items gracefully', () => {
      const collectionWithInvalid = new SafeCollectionImpl<string>(null as any)
      expect(collectionWithInvalid.isEmpty()).toBe(true)
    })
  })

  describe('add', () => {
    it('adds valid items to collection', () => {
      collection.add('item1')
      collection.add('item2')
      
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(['item1', 'item2'])
    })

    it('handles null items gracefully', () => {
      collection.add(null as any)
      
      expect(collection.size()).toBe(0)
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Attempted to add null or undefined item'),
        expect.any(Object)
      )
    })

    it('handles undefined items gracefully', () => {
      collection.add(undefined as any)
      
      expect(collection.size()).toBe(0)
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Attempted to add null or undefined item'),
        expect.any(Object)
      )
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      collection.add('item1')
      collection.add('item2')
      collection.add('item3')
    })

    it('removes items matching predicate', () => {
      const removed = collection.remove(item => item === 'item2')
      
      expect(removed).toBe(true)
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(['item1', 'item3'])
    })

    it('returns false when no items match predicate', () => {
      const removed = collection.remove(item => item === 'nonexistent')
      
      expect(removed).toBe(false)
      expect(collection.size()).toBe(3)
    })

    it('handles invalid predicate gracefully', () => {
      const removed = collection.remove(null as any)
      
      expect(removed).toBe(false)
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Predicate must be a function'),
        expect.any(Object)
      )
    })

    it('handles predicate errors gracefully', () => {
      const faultyPredicate = () => {
        throw new Error('Predicate error')
      }
      
      const removed = collection.remove(faultyPredicate)
      
      expect(removed).toBe(false)
      expect(collection.size()).toBe(3) // Items should remain
    })
  })

  describe('find', () => {
    beforeEach(() => {
      collection.add('item1')
      collection.add('item2')
      collection.add('item3')
    })

    it('finds item matching predicate', () => {
      const found = collection.find(item => item === 'item2')
      expect(found).toBe('item2')
    })

    it('returns undefined when no item matches', () => {
      const found = collection.find(item => item === 'nonexistent')
      expect(found).toBeUndefined()
    })

    it('handles invalid predicate gracefully', () => {
      const found = collection.find(null as any)
      
      expect(found).toBeUndefined()
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Predicate must be a function'),
        expect.any(Object)
      )
    })

    it('handles predicate errors gracefully', () => {
      const faultyPredicate = () => {
        throw new Error('Predicate error')
      }
      
      const found = collection.find(faultyPredicate)
      expect(found).toBeUndefined()
    })
  })

  describe('filter', () => {
    beforeEach(() => {
      collection.add('apple')
      collection.add('banana')
      collection.add('apricot')
    })

    it('filters items matching predicate', () => {
      const filtered = collection.filter(item => item.startsWith('ap'))
      expect(filtered).toEqual(['apple', 'apricot'])
    })

    it('returns empty array when no items match', () => {
      const filtered = collection.filter(item => item.startsWith('z'))
      expect(filtered).toEqual([])
    })

    it('handles invalid predicate gracefully', () => {
      const filtered = collection.filter(null as any)
      
      expect(filtered).toEqual([])
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Predicate must be a function'),
        expect.any(Object)
      )
    })
  })

  describe('utility methods', () => {
    it('isEmpty returns correct value', () => {
      expect(collection.isEmpty()).toBe(true)
      
      collection.add('item')
      expect(collection.isEmpty()).toBe(false)
    })

    it('size returns correct count', () => {
      expect(collection.size()).toBe(0)
      
      collection.add('item1')
      collection.add('item2')
      expect(collection.size()).toBe(2)
    })

    it('clear removes all items', () => {
      collection.add('item1')
      collection.add('item2')
      
      collection.clear()
      expect(collection.isEmpty()).toBe(true)
      expect(collection.size()).toBe(0)
    })

    it('toArray returns copy of items', () => {
      collection.add('item1')
      collection.add('item2')
      
      const array = collection.toArray()
      expect(array).toEqual(['item1', 'item2'])
      
      // Modifying returned array shouldn't affect collection
      array.push('item3')
      expect(collection.size()).toBe(2)
    })
  })

  describe('forEach', () => {
    beforeEach(() => {
      collection.add('item1')
      collection.add('item2')
      collection.add('item3')
    })

    it('executes callback for each item', () => {
      const callback = vi.fn()
      collection.forEach(callback)
      
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith('item1', 0)
      expect(callback).toHaveBeenCalledWith('item2', 1)
      expect(callback).toHaveBeenCalledWith('item3', 2)
    })

    it('handles invalid callback gracefully', () => {
      collection.forEach(null as any)
      
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Callback must be a function'),
        expect.any(Object)
      )
    })

    it('handles callback errors gracefully', () => {
      const faultyCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error')
      })
      
      collection.forEach(faultyCallback)
      
      expect(faultyCallback).toHaveBeenCalledTimes(3)
      expect(errorReportingService.reportHandledError).toHaveBeenCalledTimes(3)
    })
  })

  describe('map', () => {
    beforeEach(() => {
      collection.add('item1')
      collection.add('item2')
      collection.add('item3')
    })

    it('maps items to new values', () => {
      const mapped = collection.map(item => item.toUpperCase())
      expect(mapped).toEqual(['ITEM1', 'ITEM2', 'ITEM3'])
    })

    it('handles invalid callback gracefully', () => {
      const mapped = collection.map(null as any)
      
      expect(mapped).toEqual([])
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Callback must be a function'),
        expect.any(Object)
      )
    })

    it('filters out undefined results from callback errors', () => {
      const faultyCallback = vi.fn()
        .mockReturnValueOnce('ITEM1')
        .mockImplementationOnce(() => { throw new Error('Callback error') })
        .mockReturnValueOnce('ITEM3')
      
      const mapped = collection.map(faultyCallback)
      
      expect(mapped).toEqual(['ITEM1', 'ITEM3'])
      expect(errorReportingService.reportHandledError).toHaveBeenCalledTimes(1)
    })
  })

  describe('some and every', () => {
    beforeEach(() => {
      collection.add('apple')
      collection.add('banana')
      collection.add('apricot')
    })

    it('some returns true when at least one item matches', () => {
      const result = collection.some(item => item.startsWith('ap'))
      expect(result).toBe(true)
    })

    it('some returns false when no items match', () => {
      const result = collection.some(item => item.startsWith('z'))
      expect(result).toBe(false)
    })

    it('every returns true when all items match', () => {
      const result = collection.every(item => item.length > 0)
      expect(result).toBe(true)
    })

    it('every returns false when not all items match', () => {
      const result = collection.every(item => item.startsWith('ap'))
      expect(result).toBe(false)
    })

    it('handles invalid predicates gracefully', () => {
      expect(collection.some(null as any)).toBe(false)
      expect(collection.every(null as any)).toBe(false)
    })
  })
})

describe('CollectionManager', () => {
  describe('createSafeCollection', () => {
    it('creates empty collection', () => {
      const collection = CollectionManager.createSafeCollection<string>()
      expect(collection.isEmpty()).toBe(true)
    })

    it('creates collection with initial items', () => {
      const items = ['item1', 'item2']
      const collection = CollectionManager.createSafeCollection(items, 'TestCollection')
      
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(items)
    })
  })

  describe('validateCollection', () => {
    it('validates array data', () => {
      const data = ['item1', 'item2', 'item3']
      const collection = CollectionManager.validateCollection<string>(data)
      
      expect(collection.size()).toBe(3)
      expect(collection.toArray()).toEqual(data)
    })

    it('validates object with items property', () => {
      const data = { items: ['item1', 'item2'] }
      const collection = CollectionManager.validateCollection<string>(data)
      
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(['item1', 'item2'])
    })

    it('returns empty collection for invalid data', () => {
      const collection = CollectionManager.validateCollection<string>(null)
      
      expect(collection.isEmpty()).toBe(true)
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Invalid collection data'),
        expect.any(Object)
      )
    })

    it('handles validation errors gracefully', () => {
      const problematicData = {
        get items() {
          throw new Error('Property access error')
        }
      }
      
      const collection = CollectionManager.validateCollection<string>(problematicData)
      
      expect(collection.isEmpty()).toBe(true)
      expect(errorReportingService.reportError).toHaveBeenCalled()
    })
  })

  describe('safeAccess', () => {
    const testObj = {
      arrayProp: ['item1', 'item2'],
      objectProp: { items: ['item3', 'item4'] },
      safeProp: new SafeCollectionImpl(['item5', 'item6']),
      invalidProp: 'not a collection',
    }

    it('accesses array property', () => {
      const collection = CollectionManager.safeAccess<string>(
        testObj, 
        'arrayProp', 
        new SafeCollectionImpl([])
      )
      
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(['item1', 'item2'])
    })

    it('accesses object with items property', () => {
      const collection = CollectionManager.safeAccess<string>(
        testObj, 
        'objectProp', 
        new SafeCollectionImpl([])
      )
      
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(['item3', 'item4'])
    })

    it('returns existing SafeCollection', () => {
      const collection = CollectionManager.safeAccess<string>(
        testObj, 
        'safeProp', 
        new SafeCollectionImpl([])
      )
      
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(['item5', 'item6'])
    })

    it('returns fallback for invalid property', () => {
      const fallback = new SafeCollectionImpl(['fallback'])
      const collection = CollectionManager.safeAccess<string>(
        testObj, 
        'invalidProp', 
        fallback
      )
      
      expect(collection).toBe(fallback)
    })

    it('returns fallback for null object', () => {
      const fallback = new SafeCollectionImpl(['fallback'])
      const collection = CollectionManager.safeAccess<string>(
        null, 
        'anyProp', 
        fallback
      )
      
      expect(collection).toBe(fallback)
    })
  })

  describe('hasValidCollection', () => {
    it('returns true for array property', () => {
      const obj = { prop: ['item1', 'item2'] }
      expect(CollectionManager.hasValidCollection(obj, 'prop')).toBe(true)
    })

    it('returns true for object with items', () => {
      const obj = { prop: { items: ['item1', 'item2'] } }
      expect(CollectionManager.hasValidCollection(obj, 'prop')).toBe(true)
    })

    it('returns true for SafeCollection', () => {
      const obj = { prop: new SafeCollectionImpl(['item1']) }
      expect(CollectionManager.hasValidCollection(obj, 'prop')).toBe(true)
    })

    it('returns false for invalid property', () => {
      const obj = { prop: 'not a collection' }
      expect(CollectionManager.hasValidCollection(obj, 'prop')).toBe(false)
    })

    it('returns false for null object', () => {
      expect(CollectionManager.hasValidCollection(null, 'prop')).toBe(false)
    })
  })

  describe('wrapCollection', () => {
    it('wraps array property', () => {
      const obj = { prop: ['item1', 'item2'] }
      const collection = CollectionManager.wrapCollection<string>(obj, 'prop')
      
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(['item1', 'item2'])
    })

    it('wraps object with items', () => {
      const obj = { prop: { items: ['item1', 'item2'] } }
      const collection = CollectionManager.wrapCollection<string>(obj, 'prop')
      
      expect(collection.size()).toBe(2)
      expect(collection.toArray()).toEqual(['item1', 'item2'])
    })

    it('returns empty collection for invalid property', () => {
      const obj = { prop: 'not a collection' }
      const collection = CollectionManager.wrapCollection<string>(obj, 'prop')
      
      expect(collection.isEmpty()).toBe(true)
    })
  })
})

describe('safeCollectionUtils', () => {
  describe('safeAdd', () => {
    it('adds to SafeCollection', () => {
      const obj = { collection: new SafeCollectionImpl<string>() }
      const result = safeCollectionUtils.safeAdd(obj, 'collection', 'item1')
      
      expect(result).toBe(true)
      expect(obj.collection.size()).toBe(1)
    })

    it('adds to array', () => {
      const obj = { collection: [] as string[] }
      const result = safeCollectionUtils.safeAdd(obj, 'collection', 'item1')
      
      expect(result).toBe(true)
      expect(obj.collection).toEqual(['item1'])
    })

    it('returns false for invalid object', () => {
      const result = safeCollectionUtils.safeAdd(null, 'collection', 'item1')
      expect(result).toBe(false)
    })

    it('handles errors gracefully', () => {
      const obj = {
        get collection() {
          throw new Error('Property access error')
        }
      }
      
      const result = safeCollectionUtils.safeAdd(obj, 'collection', 'item1')
      
      expect(result).toBe(false)
      expect(errorReportingService.reportHandledError).toHaveBeenCalled()
    })
  })

  describe('hasItems', () => {
    it('returns true for non-empty SafeCollection', () => {
      const collection = new SafeCollectionImpl(['item1'])
      const obj = { collection }
      
      expect(safeCollectionUtils.hasItems(obj, 'collection')).toBe(true)
    })

    it('returns false for empty SafeCollection', () => {
      const collection = new SafeCollectionImpl<string>()
      const obj = { collection }
      
      expect(safeCollectionUtils.hasItems(obj, 'collection')).toBe(false)
    })

    it('returns true for non-empty array', () => {
      const obj = { collection: ['item1'] }
      expect(safeCollectionUtils.hasItems(obj, 'collection')).toBe(true)
    })

    it('returns false for empty array', () => {
      const obj = { collection: [] }
      expect(safeCollectionUtils.hasItems(obj, 'collection')).toBe(false)
    })

    it('returns false for null object', () => {
      expect(safeCollectionUtils.hasItems(null, 'collection')).toBe(false)
    })
  })

  describe('getSize', () => {
    it('returns size for SafeCollection', () => {
      const collection = new SafeCollectionImpl(['item1', 'item2'])
      const obj = { collection }
      
      expect(safeCollectionUtils.getSize(obj, 'collection')).toBe(2)
    })

    it('returns length for array', () => {
      const obj = { collection: ['item1', 'item2', 'item3'] }
      expect(safeCollectionUtils.getSize(obj, 'collection')).toBe(3)
    })

    it('returns 0 for invalid object', () => {
      expect(safeCollectionUtils.getSize(null, 'collection')).toBe(0)
    })

    it('returns 0 for invalid property', () => {
      const obj = { collection: 'not a collection' }
      expect(safeCollectionUtils.getSize(obj, 'collection')).toBe(0)
    })
  })
})

describe('collectionManager singleton', () => {
  it('exports CollectionManager instance', () => {
    expect(collectionManager).toBe(CollectionManager)
  })
})
