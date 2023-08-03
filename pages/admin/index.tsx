import { SummaryTile } from "@/components/admin/SummaryTile";
import { AdminLayout } from "@/components/layouts";
import { DashboardSummaryResponse } from "@/interfaces";
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30 * 1000,
    }
  );

  const [refreshTime, setRefreshTime] = useState(30);

  //Solucion con limpieza de evento

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime((refreshTime) => (refreshTime > 0 ? refreshTime - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //Mi solucion
  // useEffect(()=>{

  //   setTimeout(()=>{
  //     setRefreshTime(refreshTime - 1)
  //     if(refreshTime === 0) setRefreshTime(30)
  //   },1000)

  // },[refreshTime])

  if (!error && !data) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle="Ordenes Totales"
          icon={
            <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={paidOrders}
          subTitle="Ordenes pagadas"
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={notPaidOrders}
          subTitle="Ordenes pendientes"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfClients}
          subTitle="Clientes"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfProducts}
          subTitle="Productos"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={productsWithNoInventory}
          subTitle="Sin existencias"
          icon={<CategoryOutlined color="error" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={lowInventory}
          subTitle="Bajo inventario"
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />

        <SummaryTile
          title={refreshTime}
          subTitle="Actualizacion en: "
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
