import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Grid, Paper } from "@mui/material";
import axiosInstance from "../../Api/axiosInstance";
import CircularLoading from "../Loading";

const RevenueChart = () => {
    const [dataPayment, setDataPayment] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get("/payments/stats");
                setDataPayment(response.data.revenueByDay.reverse()); // Đảo ngược lại data mới đúng
                setDataCustomer(response.data.customersByDay.reverse()); // Maybe ?
                setLoading(false);
            }
            catch (error) {
                console.error("Failed to fetch revenue data:", error);
                setError("Failed to load data");
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <CircularLoading />;
    if (error) return null;

    return (
        <Box sx={{ width: "100%", maxWidth: 1200, margin: "auto", mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Stripe Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Biểu đồ Doanh Thu */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h5" align="center">Daily Revenue</Typography>
                        <LineChart
                            xAxis={[{ data: dataPayment.map(item => item.date), scaleType: "band" }]}
                            series={[{ data: dataPayment.map(item => item.revenue), label: "Revenue ($)" }]}
                            width={500}
                            height={300}
                        />
                    </Paper>
                </Grid>

                {/* Biểu đồ Khách Hàng */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h5" align="center">Daily Customers</Typography>
                        <LineChart
                            xAxis={[{ data: dataCustomer.map(item => item.date), scaleType: "band" }]}
                            series={[{ data: dataCustomer.map(item => item.count), label: "New Customers" }]}
                            width={500}
                            height={300}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RevenueChart;
