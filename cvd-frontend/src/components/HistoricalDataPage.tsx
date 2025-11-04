import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Heart,
  Activity,
  Download,
  Trash2,
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

  const handleExportData = () => {
    // Export as CSV
    const headers = [
      "Date",
      "Age",
      "Gender",
      "Systolic BP",
      "Diastolic BP",
      "BMI",
      "Heart Rate",
      "Glucose",
      "Cholesterol",
      "CVD Risk %",
      "Risk Level",
      "Model Used",
    ];

    const csvData = records.map((record) => [
      record.date.toLocaleDateString(),
      record.age,
      record.gender,
      record.sysBP,
      record.diaBP,
      record.bmi,
      record.heartRate,
      record.glucose,
      record.cholesterol,
      (record.riskLevel * 100).toFixed(1),
      record.riskLevelCategory,
      record.bestModel,
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cvd-health-history-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
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
