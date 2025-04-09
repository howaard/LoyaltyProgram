import { useState, useRef } from 'react'

export default function TicketHistory({ tickets = [] }) {
  const ticketRef = useRef(null)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const filteredTickets = tickets.filter(t => {
    const ticketMonth = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' })
    return (
      (!selectedMonth || ticketMonth === selectedMonth) &&
      (!selectedClass || t.ticketClass === selectedClass)
    )
  })

  const exportCSV = (data) => {
    const header = ['Flight', 'From', 'To', 'Class', 'Trip', 'Date', 'XP']
    const rows = data.map(t => [
      t.flightNum,
      t.from,
      t.to,
      t.ticketClass,
      t.tripType,
      new Date(t.date).toLocaleDateString(),
      t.xpEarned
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map(e => e.join(',')).join('\n')
  
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'ticket_history.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const exportPDF = async () => {
    try {
      setIsExporting(true)
      // Load the html2pdf library
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || html2pdfModule
      
      if (!ticketRef.current) {
        console.error('No ticketRef found')
        setIsExporting(false)
        return
      }

      // Create a clean container for PDF content
      const container = document.createElement('div')
      container.style.fontFamily = 'Arial, sans-serif'
      container.style.fontSize = '12px'
      container.style.padding = '20px'
      container.style.color = '#111'
      container.style.backgroundColor = '#fff'
      container.style.width = '800px' // Fixed width for PDF
      
      // Add title
      const title = document.createElement('h2')
      title.textContent = '🛫 Ticket History & XP Earned'
      title.style.marginBottom = '20px'
      title.style.fontSize = '18px'
      title.style.color = '#132452'
      container.appendChild(title)
      
      // Create table
      const table = document.createElement('table')
      table.style.width = '100%'
      table.style.borderCollapse = 'collapse'
      table.style.marginTop = '10px'
      
      // Create header row
      const thead = document.createElement('thead')
      const headerRow = document.createElement('tr')
      
      const headers = ['Flight', 'Route', 'Class', 'Trip', 'Date', 'XP']
      headers.forEach(headerText => {
        const th = document.createElement('th')
        th.textContent = headerText
        th.style.border = '1px solid #ddd'
        th.style.padding = '8px'
        th.style.background = '#f8f9fa'
        th.style.fontWeight = 'bold'
        headerRow.appendChild(th)
      })
      
      thead.appendChild(headerRow)
      table.appendChild(thead)
      
      // Create table body
      const tbody = document.createElement('tbody')
      
      filteredTickets.forEach(ticket => {
        const row = document.createElement('tr')
        
        // Add cells
        const data = [
          ticket.flightNum,
          `${ticket.from} → ${ticket.to}`,
          ticket.ticketClass,
          ticket.tripType,
          new Date(ticket.date).toLocaleDateString(),
          ticket.xpEarned.toString()
        ]
        
        data.forEach((text, i) => {
          const td = document.createElement('td')
          td.textContent = text
          td.style.border = '1px solid #ddd'
          td.style.padding = '8px'
          
          // Style the XP column differently
          if (i === 5) {
            td.style.color = '#0284c7'
            td.style.fontWeight = 'bold'
            td.style.textAlign = 'right'
          }
          
          row.appendChild(td)
        })
        
        tbody.appendChild(row)
      })
      
      table.appendChild(tbody)
      container.appendChild(table)
      
      // Add filter information
      if (selectedMonth || selectedClass) {
        const filterInfo = document.createElement('p')
        filterInfo.style.marginTop = '15px'
        filterInfo.style.fontSize = '11px'
        filterInfo.style.color = '#666'
        
        let filterText = 'Filtered by: '
        if (selectedMonth) filterText += `Month: ${selectedMonth}`
        if (selectedMonth && selectedClass) filterText += ', '
        if (selectedClass) filterText += `Class: ${selectedClass}`
        
        filterInfo.textContent = filterText
        container.appendChild(filterInfo)
      }
      
      // Generate PDF
      const opt = {
        margin: 10,
        filename: 'ticket_history.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      }
      
      await html2pdf().from(container).set(opt).save()
      setIsExporting(false)
    } catch (error) {
      console.error('PDF export failed:', error)
      setIsExporting(false)
    }
  }
    
  return (
    <div ref={ticketRef} className="mt-30 bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-[#132452] mb-4">🛫 Ticket History & XP Earned</h2>

      {tickets.length === 0 ? (
        <p className="text-gray-500 text-sm">No ticket history available.</p>
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <div className="flex justify-end gap-3 mb-4">
            <button
              onClick={() => exportCSV(filteredTickets)}
              className="bg-[#0284c7] text-white text-xs px-3 py-1 rounded hover:bg-[#0369a1]"
              disabled={isExporting}
            >
              Export CSV
            </button>
            <button
              onClick={exportPDF}
              disabled={isExporting}
              className="bg-[#10b981] text-white text-xs px-3 py-1 rounded hover:bg-[#059669]"
            >
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={isExporting}
            >
              <option value="">All Months</option>
              {Array.from(new Set(tickets.map(t => new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' })))).map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={isExporting}
            >
              <option value="">All Classes</option>
              {['Economy', 'Premium Economy', 'Business', 'First Class'].map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-4">Flight</th>
                <th className="py-2 px-4">Route</th>
                <th className="py-2 px-4">Class</th>
                <th className="py-2 px-4">Trip</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4 text-right">XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4 font-mono">{t.flightNum}</td>
                  <td className="py-2 px-4">{t.from} → {t.to}</td>
                  <td className="py-2 px-4">{t.ticketClass}</td>
                  <td className="py-2 px-4 capitalize">{t.tripType}</td>
                  <td className="py-2 px-4">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 text-right text-[#0284c7] font-semibold">{t.xpEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}