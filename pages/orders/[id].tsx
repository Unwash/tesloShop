import { ShopLayout } from "@/components/layouts";
import {
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  Link,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { CartList, OrderSumary } from "@/components/cart";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import { countries } from "@/utils/countries";
import { tesloApi } from "@/api";
import { useRouter } from "next/router";
import { useState } from "react";

export type OrderResponseBody = {
  id: string;
  status:
      | "CREATED"
      | "SAVED"
      | "APPROVED"
      | "VOIDED"
      | "COMPLETED"
      | "PAYER_ACTION_REQUIRED";

};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter()
  const { shippingAddress, _id, numberOfItems, isPaid, orderItems } = order;

  const [isPaying, setIsPaying] = useState(false)

  const onOrderCompleted = async(details:OrderResponseBody) => {


    if(details.status !== "COMPLETED" ){
      return alert("No hay pago en paypal")
    }

    setIsPaying(true)

    try {
      
      const {data} = await tesloApi.post(`/orders/pay`,{
        transactionId:details.id,
        orderId:_id
      })

      router.reload()


    } catch (error) {
      setIsPaying(false)
      console.log(error)
      alert(error)
    }


  }

  return (
    <ShopLayout
      title="Resumen de orden 213213"
      pageDescription="Resumen de la orden"
    >
      <>
        <Typography variant="h1" component="h1">
          Orden: {_id}{" "}
        </Typography>

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


                  
                  <Box sx={{display: isPaying ?  "flex" :  "none"}}  justifyContent="center" className="fadeIn">
                  <CircularProgress />
                  </Box>

                  <Box sx={{display: !isPaying ?  "flex" :  "none", flex:1, flexDirection:"column"}}>
                  {!isPaid && (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details)
                          const name = details.payer.name!.given_name;
                          
                        });
                      }}
                    />
                  )}
                  </Box>

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
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query; // your fetch function here

  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
