export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Create New Event</h1>

        <form className="max-w-2xl bg-white p-8 rounded-lg">
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Event Title</label>
              <input type="text" placeholder="e.g., Tech Summit 2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea rows={4} placeholder="Tell attendees about your event" className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Fest</option>
                  <option>Workshop</option>
                  <option>Comedy</option>
                  <option>Music</option>
                  <option>Sports</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Event Date</label>
                <input type="datetime-local" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Venue Name</label>
                <input type="text" placeholder="e.g., Convention Center" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Address</label>
                <input type="text" placeholder="Full address" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Latitude</label>
                <input type="number" placeholder="e.g., 28.6139" step="0.0001" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Longitude</label>
                <input type="number" placeholder="e.g., 77.2090" step="0.0001" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Event Image</label>
              <input type="file" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Ticket Tiers</h3>
              <div className="space-y-4">
                <div className="border border-gray-300 p-4 rounded-lg">
                  <input type="text" placeholder="Tier name (e.g., Early Bird)" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Price (₹)" className="px-4 py-2 border border-gray-300 rounded-lg" />
                    <input type="number" placeholder="Quantity" className="px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>
              <button type="button" className="mt-4 text-blue-600 hover:underline font-semibold">+ Add Another Tier</button>
            </div>

            <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
