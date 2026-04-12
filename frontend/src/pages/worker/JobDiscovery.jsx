import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Clock, Search, MapPin, DollarSign, Briefcase, ChevronRight, Filter, X, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardTitle, CardHeader, Button, Badge, Input, LoadingSpinner } from "../../components/ui";

const JobCard = ({ job }) => (
    <Card variant="default" hover className="transition-all duration-200">
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Building size={14} />
                                <span>{job.Employer?.companyName || 'Verified Employer'}</span>
                                {job.Employer?.verified && (
                                    <Badge variant="success" size="sm">Verified</Badge>
                                )}
                            </div>
                        </div>
                        {job.hasApplied && (
                            <Badge variant="success" size="sm">
                                Already Applied
                            </Badge>
                        )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="text-gray-700">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="text-gray-700">KES {job.budget}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                            <Clock size={14} className="text-blue-500" />
                            <span className="text-blue-700">Posted {job.postedTime || 'recently'}</span>
                        </div>
                    </div>
                    
                    {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" size="sm">
                                    {skill}
                                </Badge>
                            ))}
                            {job.skills.length > 3 && (
                                <Badge variant="outline" size="sm">
                                    +{job.skills.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
                
                <Link
                    to={`/worker/jobs/${job.id}`}
                    className={`mt-4 md:mt-0 p-3 rounded-xl transition-all flex items-center justify-center ${
                        job.hasApplied 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    <ChevronRight size={20} />
                </Link>
            </div>
        </CardContent>
    </Card>
);

export default function JobDiscovery() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [budgetRange, setBudgetRange] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        'Electrician', 'House help', 'Mason', 'Contractor', 
        'House Keeping', 'Carpenter', 'Painter', 'Plumber', 
        'Gardener', 'Driver', 'Security', 'Cleaner'
    ];
    
    const locations = [
        'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 
        'Thika', 'Kitale', 'Garissa', 'Kakamega', 'Nyeri'
    ];

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await API.get('/jobs');
                setJobs(data);
                setFilteredJobs(data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let filtered = jobs;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(job => 
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.Employer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(job => 
                job.category === selectedCategory
            );
        }

        // Filter by location
        if (selectedLocation) {
            filtered = filtered.filter(job => 
                job.location.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        // Filter by budget range
        if (budgetRange) {
            const [min, max] = budgetRange.split('-').map(Number);
            filtered = filtered.filter(job => {
                const jobBudget = Number(job.budget);
                if (max) {
                    return jobBudget >= min && jobBudget <= max;
                }
                return jobBudget >= min;
            });
        }

        setFilteredJobs(filtered);
    }, [jobs, searchTerm, selectedCategory, selectedLocation, budgetRange]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedLocation('');
        setBudgetRange('');
        setShowFilters(false);
    };

    const activeFiltersCount = [selectedCategory, selectedLocation, budgetRange].filter(Boolean).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" text="Finding opportunities..." />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Available Opportunities</h2>
                    <p className="text-gray-600 mt-1">
                        {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                    </p>
                </div>
                
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                >
                    <Filter size={16} />
                    Filters
                    {activeFiltersCount > 0 && (
                        <Badge variant="primary" size="sm">{activeFiltersCount}</Badge>
                    )}
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    placeholder="Search by job title, skills, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 text-lg"
                />
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <Card variant="ghost" className="p-6">
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Filter by</h3>
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                <X size={16} className="mr-1" />
                                Clear all
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Locations</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Budget Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget Range
                                </label>
                                <select
                                    value={budgetRange}
                                    onChange={(e) => setBudgetRange(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Any Budget</option>
                                    <option value="0-5000">Under KES 5,000</option>
                                    <option value="5000-10000">KES 5,000 - 10,000</option>
                                    <option value="10000-20000">KES 10,000 - 20,000</option>
                                    <option value="20000-50000">KES 20,000 - 50,000</option>
                                    <option value="50000-999999">Over KES 50,000</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Results */}
            {filteredJobs.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-16">
                        <Briefcase className="mx-auto text-gray-300 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || selectedCategory || selectedLocation || budgetRange
                                ? "Try adjusting your filters or search terms"
                                : "No jobs are currently available. Check back soon!"}
                        </p>
                        {(searchTerm || selectedCategory || selectedLocation || budgetRange) && (
                            <Button onClick={clearFilters}>Clear Filters</Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}

            {/* Load More (if needed) */}
            {filteredJobs.length > 10 && (
                <div className="text-center pt-8">
                    <Button variant="outline" size="lg">
                        Load More Jobs
                        <ChevronRight size={20} />
                    </Button>
                </div>
            )}
        </div>
    );
}