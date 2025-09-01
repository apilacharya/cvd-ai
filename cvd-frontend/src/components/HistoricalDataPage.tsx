import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Heart,
  Activity,
  Filter,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRiskLevel } from "@/lib/utils";

interface HistoricalRecord {
  id: string;
  date: Date;
  riskLevel: number;
  accuracy: number;
  bestModel: string;
  age: number;
  gender: string;
  systolicBP: number;
  diastolicBP: number;
  cholesterol: number;
  bmi: number;
  heartRate: number;
}

const mockHistoricalData: HistoricalRecord[] = [
  {
    id: "1",
    date: new Date("2024-08-15"),
    riskLevel: 0.25,
    accuracy: 0.92,
    bestModel: "Neural Network",
    age: 45,
    gender: "Male",
    systolicBP: 130,
    diastolicBP: 85,
    cholesterol: 195,
    bmi: 26.5,
    heartRate: 72,
  },
  {
    id: "2",
    date: new Date("2024-07-20"),
    riskLevel: 0.18,
    accuracy: 0.89,
    bestModel: "Random Forest",
    age: 45,
    gender: "Male",
    systolicBP: 125,
    diastolicBP: 80,
    cholesterol: 185,
    bmi: 25.8,
    heartRate: 68,
  },
  {
    id: "3",
    date: new Date("2024-06-10"),
    riskLevel: 0.32,
    accuracy: 0.87,
    bestModel: "SVM",
    age: 44,
    gender: "Male",
    systolicBP: 140,
    diastolicBP: 90,
    cholesterol: 210,
    bmi: 27.2,
    heartRate: 78,
  },
];

export function HistoricalDataPage() {
  const [records, setRecords] = useState<HistoricalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HistoricalRecord[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "risk" | "accuracy">("date");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setRecords(mockHistoricalData);
      setFilteredRecords(mockHistoricalData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = records.filter(
      (record) =>
        record.bestModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date.toLocaleDateString().includes(searchTerm)
    );

    // Sort records
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "risk":
          return b.riskLevel - a.riskLevel;
        case "accuracy":
          return b.accuracy - a.accuracy;
        default:
          return 0;
      }
    });

    setFilteredRecords(filtered);
  }, [records, searchTerm, sortBy]);

  const handleViewDetails = (record: HistoricalRecord) => {
    console.log("View details for record:", record.id);
    // Implement view details functionality
  };

  const handleDeleteRecord = (recordId: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== recordId));
    console.log("Delete record:", recordId);
  };

  const handleExportData = () => {
    console.log("Export data functionality");
    // Implement export functionality
  };

  const calculateTrend = () => {
    if (records.length < 2) return null;

    const latest = records[0];
    const previous = records[1];
    const change = latest.riskLevel - previous.riskLevel;

    return {
      change,
      direction: change > 0 ? "increase" : "decrease",
      percentage: Math.abs((change / previous.riskLevel) * 100),
    };
  };

  const trend = calculateTrend();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-96"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Loading Your Health History
              </h3>
              <p className="text-gray-600">
                Retrieving your cardiovascular assessments...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Health History
              </h1>
              <p className="text-gray-600 text-lg">
                Track your cardiovascular health assessments over time
              </p>
            </div>
            <Button
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Total Assessments
                    </p>
                    <p className="text-3xl font-bold text-blue-700">
                      {records.length}
                    </p>
                  </div>
                  <Heart className="h-12 w-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Latest Risk Level
                    </p>
                    <p className="text-3xl font-bold text-green-700">
                      {records.length > 0
                        ? `${(records[0].riskLevel * 100).toFixed(1)}%`
                        : "N/A"}
                    </p>
                  </div>
                  <Activity className="h-12 w-12 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Trend</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-purple-700">
                        {trend ? `${trend.percentage.toFixed(1)}%` : "N/A"}
                      </p>
                      {trend && (
                        <TrendingUp
                          className={`h-6 w-6 ${
                            trend.direction === "increase"
                              ? "text-red-500 rotate-0"
                              : "text-green-500 rotate-180"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                  <TrendingUp className="h-12 w-12 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search by model or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "date" | "risk" | "accuracy")
                    }
                    className="h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="risk">Sort by Risk Level</option>
                    <option value="accuracy">Sort by Accuracy</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Records List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Records Found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Start by taking your first health assessment"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecords.map((record, index) => {
              const riskInfo = getRiskLevel(record.riskLevel);

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className={`p-3 rounded-full ${riskInfo.color
                                .replace("text-", "bg-")
                                .replace("-600", "-100")}`}
                            >
                              <Heart className={`h-6 w-6 ${riskInfo.color}`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">
                                Assessment from{" "}
                                {record.date.toLocaleDateString()}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {record.date.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                Risk Level
                              </p>
                              <p
                                className={`text-lg font-bold ${riskInfo.color}`}
                              >
                                {(record.riskLevel * 100).toFixed(1)}%
                              </p>
                              <p className={`text-xs ${riskInfo.color}`}>
                                {riskInfo.level}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Best Model
                              </p>
                              <p className="text-lg font-semibold">
                                {record.bestModel}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(record.accuracy * 100).toFixed(1)}% accuracy
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Blood Pressure
                              </p>
                              <p className="text-lg font-semibold">
                                {record.systolicBP}/{record.diastolicBP}
                              </p>
                              <p className="text-xs text-gray-500">mmHg</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">BMI</p>
                              <p className="text-lg font-semibold">
                                {record.bmi}
                              </p>
                              <p className="text-xs text-gray-500">kg/m²</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(record)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
