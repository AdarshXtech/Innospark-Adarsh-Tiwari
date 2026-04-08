export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <a href="/create-event" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            Create Event
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">Total Events</p>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">Tickets Sold</p>
            <p className="text-3xl font-bold">124</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">Revenue</p>
            <p className="text-3xl font-bold">₹37,200</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">Check-ins</p>
            <p className="text-3xl font-bold">89</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Your Events</h2>
          <div className="space-y-4">
            <div className="border border-gray-300 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">Tech Summit 2026</h3>
                <p className="text-gray-600 text-sm">Apr 15, 2026</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">45 tickets sold</p>
                <button className="text-blue-600 hover:underline text-sm">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
