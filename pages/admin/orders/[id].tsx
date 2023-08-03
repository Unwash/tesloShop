import { AdminLayout, ShopLayout } from "@/components/layouts";
import {
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  CardContent,
  Chip,

} from "@mui/material";
import { CartList, OrderSumary } from "@/components/cart";
import {
    AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { GetServerSideProps, NextPage } from "next";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import { countries } from "@/utils/countries";





interface Props {
  order: IOrder;
}

const OrderDetailPage: NextPage<Props> = ({ order }) => {

  const { shippingAddress, _id, numberOfItems, isPaid, orderItems } = order;




  return (
    <AdminLayout
      title={`Resumen de orden`}
      subTitle={`OrdenId: ${_id}`}
      icon={<AirplaneTicketOutlined  sx={{marginRight:"5px"}}/>}
    >
      <>


        <Chip
          sx={{ my: 2, display: !isPaid ? "" : "none" }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />

        <Chip
          sx={{ my: 2, display: isPaid ? "" : "none" }}
          label="Orden ya fue pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />

        <Grid container className="fadeIn">
          <Grid item xs={12} sm={7}>
            <CartList productsFromProp={orderItems} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2">
                  Resumen ({numberOfItems}{" "}
                  {numberOfItems > 1 ? "productos" : "producto"})
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">
                    Dirección de entrega
                  </Typography>
                </Box>

                <Typography>
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </Typography>

                <Typography>
                  {shippingAddress.address}{" "}
                  {shippingAddress.address2
                    ? `, ${shippingAddress.address2}`
                    : ""}
                </Typography>

                <Typography>
                  {shippingAddress.city} {shippingAddress.zip}
                </Typography>

                <Typography>
                  {
                    countries.find((c) => c.code === shippingAddress.country)
                      ?.name
                  }
                </Typography>

                <Typography>{shippingAddress.phone}</Typography>

                <Divider sx={{ my: 1 }} />

                <OrderSumary order={order} />

                <Box sx={{ mt: 3, display:"flex", flexDirection: "column" }}>


                  <Chip
                    sx={{ my: 2, display: isPaid ? "" : "none" }}
                    label="Orden ya fue pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query; 

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order
    },
  };
};

export default OrderDetailPage;