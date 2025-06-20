import { Button } from '../ui/button';

const BoloForm = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Property Management Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage properties across Syria</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Info Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Property Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Property Overview</h3>
                    <p className="text-sm text-gray-500">Total properties: 128</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Active</p>
                    <p className="text-xl font-bold text-green-600">89</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Maintenance</p>
                    <p className="text-xl font-bold text-yellow-500">21</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Vacant</p>
                    <p className="text-xl font-bold text-blue-600">12</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Rented</p>
                    <p className="text-xl font-bold text-purple-600">6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full py-2 px-4 bg-primary hover:bg-primary text-white rounded-md transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Property
                  </Button>
                  <Button className="w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View All Properties
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Property Locations</h3>
                <p className="mt-1 text-sm text-gray-500">Interactive map of all properties in Syria</p>
              </div>
              
              <div className="relative h-[500px]">
                {/* Syria Map Image */}
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/9/94/Syria_location_map.svg" 
                  alt="Syria Map"
                  className="w-full h-full object-contain"
                />
                
                {/* Property Markers */}
                <div className="absolute bottom-[25%] left-[32%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                  <div className="w-4 h-4 bg-green-600 rounded-full relative">
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Damascus - 42 Properties
                    </span>
                  </div>
                </div>
                <div className="absolute top-[30%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                  <div className="w-4 h-4 bg-green-600 rounded-full relative">
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Aleppo - 28 Properties
                    </span>
                  </div>
                </div>
                <div className="absolute top-[60%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                  <div className="w-4 h-4 bg-green-600 rounded-full relative">
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Homs - 19 Properties
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Active Properties</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Under Maintenance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Vacant Properties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoloForm;