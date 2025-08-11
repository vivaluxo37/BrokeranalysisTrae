import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DataTable, type ColumnDef } from '../data-table'

interface TestData {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
  score: number
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', score: 85 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', score: 92 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', score: 78 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', score: 95 },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive', score: 67 },
]

const mockColumns: ColumnDef<TestData>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ value }) => (
      <span className={value === 'active' ? 'text-green-400' : 'text-red-400'}>
        {value}
      </span>
    ),
  },
  {
    id: 'score',
    header: 'Score',
    accessorKey: 'score',
    sortable: true,
    align: 'right',
  },
]

describe('DataTable', () => {
  it('renders table with data', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        pagination={false}
        filtering={false}
        sorting={false}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('95')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        loading={true}
      />
    )

    // Should show skeleton rows
    const skeletonElements = screen.getAllByRole('generic')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('shows empty message when no data', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        emptyMessage="No users found"
        loading={false}
      />
    )

    expect(screen.getByText('No users found')).toBeInTheDocument()
  })

  it('handles sorting when enabled', async () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        sorting={true}
        pagination={false}
        filtering={false}
      />
    )

    const nameHeader = screen.getByRole('button', { name: /name/i })
    
    // Click to sort ascending
    fireEvent.click(nameHeader)
    
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      // First row should be header, second should be Alice (alphabetically first)
      expect(rows[1]).toHaveTextContent('Alice Brown')
    })

    // Click again to sort descending
    fireEvent.click(nameHeader)
    
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      // Second row should now be John (alphabetically last)
      expect(rows[1]).toHaveTextContent('John Doe')
    })
  })

  it('handles global filtering when enabled', async () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        filtering={true}
        pagination={false}
        sorting={false}
        searchPlaceholder="Search users..."
      />
    )

    const searchInput = screen.getByPlaceholderText('Search users...')
    
    fireEvent.change(searchInput, { target: { value: 'john' } })
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })
  })

  it('handles pagination when enabled', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        pagination={true}
        pageSize={2}
        filtering={false}
        sorting={false}
      />
    )

    // Should show pagination info
    expect(screen.getByText(/showing 1 to 2 of 5 results/i)).toBeInTheDocument()
    
    // Should show page navigation
    const nextButton = screen.getByRole('button', { name: /chevronright/i })
    const prevButton = screen.getByRole('button', { name: /chevronleft/i })
    
    expect(prevButton).toBeDisabled()
    expect(nextButton).not.toBeDisabled()
    
    // Click next page
    fireEvent.click(nextButton)
    
    expect(screen.getByText(/showing 3 to 4 of 5 results/i)).toBeInTheDocument()
  })

  it('handles page size changes', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        pagination={true}
        pageSize={2}
        pageSizeOptions={[2, 5, 10]}
        filtering={false}
        sorting={false}
      />
    )

    // Should show current page size
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    
    // Change page size
    const pageSizeSelect = screen.getByDisplayValue('2')
    fireEvent.click(pageSizeSelect)
    
    const option5 = screen.getByText('5')
    fireEvent.click(option5)
    
    // Should now show all 5 items
    expect(screen.getByText(/showing 1 to 5 of 5 results/i)).toBeInTheDocument()
  })

  it('handles row clicks when onRowClick is provided', () => {
    const onRowClick = vi.fn()
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onRowClick={onRowClick}
        pagination={false}
        filtering={false}
        sorting={false}
      />
    )

    const firstDataRow = screen.getAllByRole('row')[1] // Skip header row
    fireEvent.click(firstDataRow)
    
    expect(onRowClick).toHaveBeenCalledWith(mockData[0])
  })

  it('renders custom cell content', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        pagination={false}
        filtering={false}
        sorting={false}
      />
    )

    // Status column should render custom cell with colored text
    const activeStatus = screen.getAllByText('active')[0]
    expect(activeStatus).toHaveClass('text-green-400')
    
    const inactiveStatus = screen.getAllByText('inactive')[0]
    expect(inactiveStatus).toHaveClass('text-red-400')
  })

  it('applies column alignment correctly', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        pagination={false}
        filtering={false}
        sorting={false}
      />
    )

    // Score column should be right-aligned
    const scoreHeader = screen.getByText('Score')
    expect(scoreHeader.closest('th')).toHaveClass('text-right')
  })

  it('disables sorting for non-sortable columns', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        sorting={true}
        pagination={false}
        filtering={false}
      />
    )

    // Status column should not be sortable (no button)
    const statusHeader = screen.getByText('Status')
    expect(statusHeader.closest('th')).not.toContainElement(
      screen.queryByRole('button', { name: /status/i })
    )
  })
})