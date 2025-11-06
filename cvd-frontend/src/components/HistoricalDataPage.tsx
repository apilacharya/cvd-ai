import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Heart,
  Activity,
  Trash2,
  HeartPulse,
  Stethoscope,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRiskLevel } from "@/lib/utils";
import { cvdReportsApi } from "@/services/api";
import type { CVDReport } from "@/types/auth";

interface HistoricalRecord {
  id: string;
  date: Date;
  riskLevel: number;
  riskLevelCategory: "low" | "medium" | "high";
  bestModel: string;
  age: number;
  gender: string;
  sysBP: number;
  diaBP: number;
  bmi: number;
  heartRate: number;
  glucose: number;
  cholesterol: number;
}

export function HistoricalDataPage() {
  const [records, setRecords] = useState<HistoricalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch historical reports from backend using dedicated history endpoint
        const response = await cvdReportsApi.getHistory();
        console.log("Fetched historical data:", response);

        // Extract reports from response
        const reportsData = response.data?.reports || [];

        console.log("Reports data:", reportsData);

        const transformedRecords: HistoricalRecord[] = reportsData.map(
          (report: CVDReport) => ({
            id: report._id,
            date: new Date(report.reportDate),
            riskLevel: report.predictionResult.riskScore / 100, // Convert to 0-1 scale
            riskLevelCategory: report.predictionResult.riskLevel,
            bestModel: report.predictionResult.modelUsed,
            age: report.userAge,
            gender: report.userGender,
            sysBP: report.healthData.sysBP,
            diaBP: report.healthData.diaBP,
            bmi: report.healthData.BMI,
            heartRate: report.healthData.heartRate,
            glucose: report.healthData.glucose,
            cholesterol: report.healthData.totChol,
          })
        );

        console.log("Transformed records:", transformedRecords);
        setRecords(transformedRecords);
      } catch (err) {
        console.error("Failed to fetch historical data:", err);
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await cvdReportsApi.deleteReport(recordId);
      setRecords((prev) => prev.filter((record) => record.id !== recordId));
      console.log("Deleted record:", recordId);
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete record. Please try again.");
    }
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="container mx-auto max-w-6xl flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-12">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-6"
                >
                  <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Loading Your Health History
                </h3>
                <p className="text-gray-600">
                  Retrieving your assessment records...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 relative overflow-hidden">
      {/* Decorative Health Icons - Static Random Positions */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Health Icons scattered randomly */}
        <div className="absolute top-[4%] left-[2%] opacity-16">
          <HeartPulse className="w-20 h-20 text-red-200" />
        </div>
        
        <div className="absolute top-[18%] right-[11%] opacity-13">
          <Stethoscope className="w-18 h-18 text-emerald-200" />
        </div>
        
        <div className="absolute top-[51%] left-[7%] opacity-15">
          <Activity className="w-22 h-22 text-teal-200" />
        </div>
        
        <div className="absolute top-[89%] left-[3%] opacity-14">
          <Shield className="w-18 h-18 text-blue-200" />
        </div>

        <div className="absolute top-[37%] left-[1%] opacity-12">
          <HeartPulse className="w-16 h-16 text-red-100" />
        </div>

        <div className="absolute top-[72%] right-[4%] opacity-14">
          <Activity className="w-19 h-19 text-teal-200" />
        </div>

        <div className="absolute top-[96%] right-[8%] opacity-13">
          <Stethoscope className="w-20 h-20 text-emerald-200" />
        </div>

        <div className="absolute top-[28%] right-[2%] opacity-15">
          <Shield className="w-17 h-17 text-blue-200" />
        </div>

        <div className="absolute top-[61%] left-[12%] opacity-12">
          <HeartPulse className="w-15 h-15 text-red-200" />
        </div>

        <div className="absolute top-[9%] left-[18%] opacity-11">
          <Activity className="w-14 h-14 text-teal-100" />
        </div>

        <div className="absolute top-[44%] right-[19%] opacity-13">
          <Stethoscope className="w-16 h-16 text-emerald-100" />
        </div>

        <div className="absolute top-[81%] left-[24%] opacity-12">
          <Shield className="w-15 h-15 text-blue-100" />
        </div>

        {/* Plus Signs scattered randomly */}
        <div className="absolute top-[11%] right-[15%] opacity-11">
          <div className="relative w-13 h-13">
            <div className="absolute inset-x-0 top-1/2 h-4 bg-red-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-4 bg-red-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>
        
        <div className="absolute top-[93%] left-[16%] opacity-12">
          <div className="relative w-14 h-14">
            <div className="absolute inset-x-0 top-1/2 h-4 bg-emerald-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-4 bg-emerald-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[6%] left-[27%] opacity-10">
          <div className="relative w-11 h-11">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-teal-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-teal-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[68%] right-[21%] opacity-11">
          <div className="relative w-12 h-12">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-blue-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-blue-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[34%] left-[22%] opacity-9">
          <div className="relative w-10 h-10">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-red-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-red-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[74%] right-[26%] opacity-10">
          <div className="relative w-11 h-11">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-emerald-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-emerald-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[48%] right-[6%] opacity-11">
          <div className="relative w-10 h-10">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-teal-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-teal-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[23%] left-[9%] opacity-10">
          <div className="relative w-9 h-9">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-blue-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-blue-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[56%] left-[5%] opacity-12">
          <div className="relative w-12 h-12">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-red-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-red-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[15%] right-[24%] opacity-9">
          <div className="relative w-10 h-10">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-emerald-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-emerald-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[87%] right-[13%] opacity-11">
          <div className="relative w-11 h-11">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-teal-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-teal-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Health History
            </h1>
            <p className="text-gray-600 text-lg">
              Track your cardiovascular health assessments over time
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      Total Assessments
                    </p>
                    <p className="text-3xl font-bold text-emerald-700">
                      {records.length}
                    </p>
                  </div>
                  <Heart className="h-12 w-12 text-emerald-500" />
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

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-600">Trend</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-teal-700">
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
                  <TrendingUp className="h-12 w-12 text-teal-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Records List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {records.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Records Found
                </h3>
                <p className="text-gray-500">
                  Start by taking your first health assessment
                </p>
              </CardContent>
            </Card>
          ) : (
            records.map((record, index) => {
              const riskInfo = getRiskLevel(record.riskLevel);

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                                {record.riskLevelCategory} risk
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Blood Pressure
                              </p>
                              <p className="text-lg font-semibold">
                                {record.sysBP}/{record.diaBP}
                              </p>
                              <p className="text-xs text-gray-500">mmHg</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">BMI</p>
                              <p className="text-lg font-semibold">
                                {record.bmi.toFixed(1)}
                              </p>
                              <p className="text-xs text-gray-500">kg/m²</p>
                            </div>
                          </div>

                          {/* Additional Health Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-sm text-gray-600">
                                Heart Rate
                              </p>
                              <p className="text-lg font-semibold">
                                {record.heartRate}
                              </p>
                              <p className="text-xs text-gray-500">bpm</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Glucose Level
                              </p>
                              <p className="text-lg font-semibold">
                                {record.glucose}
                              </p>
                              <p className="text-xs text-gray-500">mg/dL</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Cholesterol
                              </p>
                              <p className="text-lg font-semibold">
                                {record.cholesterol}
                              </p>
                              <p className="text-xs text-gray-500">mg/dL</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
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
