import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ActivityIndicator, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { Order } from '../hooks/use-supabase-cases-view-model';
import { orderCardStyles } from '../styles/order-card.styles';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FF9500';
      case 'processing':
        return '#007AFF';
      case 'shipped':
        return '#5856D6';
      case 'delivered':
        return supabaseGreen;
      case 'cancelled':
        return '#ef4444';
      default:
        return colors.actionDescription;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusColor = getStatusColor(order.status);

  return (
    <View
      style={[
        orderCardStyles.card,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      {/* Header */}
      <View style={orderCardStyles.header}>
        <View style={orderCardStyles.orderInfo}>
          <ThemedText
            style={[
              orderCardStyles.orderId,
              { color: colors.bodyText },
            ]}
          >
            Order #{order.id}
          </ThemedText>
          <ThemedText
            style={[
              orderCardStyles.orderDate,
              { color: colors.actionDescription },
            ]}
          >
            {formatDate(order.created_at)}
          </ThemedText>
        </View>
        <View
          style={[
            orderCardStyles.statusBadge,
            {
              backgroundColor: statusColor + '15',
              borderWidth: 1,
              borderColor: statusColor + '30',
            },
          ]}
        >
          <ThemedText
            style={{
              color: statusColor,
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'capitalize',
            }}
          >
            {order.status}
          </ThemedText>
        </View>
      </View>

      {/* Order Items */}
      <View style={orderCardStyles.itemsSection}>
        <ThemedText
          style={[
            orderCardStyles.itemsTitle,
            { color: colors.labelText },
          ]}
        >
          Items ({order.items.length})
        </ThemedText>
        {order.items.map((item, index) => (
          <View
            key={index}
            style={[
              orderCardStyles.itemRow,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
              },
            ]}
          >
            <View style={orderCardStyles.itemInfo}>
              <ThemedText
                style={[
                  orderCardStyles.itemName,
                  { color: colors.bodyText },
                ]}
              >
                {item.name}
              </ThemedText>
              <ThemedText
                style={[
                  orderCardStyles.itemDetails,
                  { color: colors.actionDescription },
                ]}
              >
                Qty: {item.quantity} × ${item.price.toFixed(2)}
              </ThemedText>
            </View>
            <ThemedText
              style={[
                orderCardStyles.itemTotal,
                { color: colors.bodyText },
              ]}
            >
              ${(item.quantity * item.price).toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={orderCardStyles.totalSection}>
        <ThemedText
          style={[
            orderCardStyles.totalLabel,
            { color: colors.labelText },
          ]}
        >
          Total
        </ThemedText>
        <ThemedText
          style={[
            orderCardStyles.totalPrice,
            { color: colors.bodyText },
          ]}
        >
          ${order.total_price.toFixed(2)}
        </ThemedText>
      </View>

      {/* Shipping and Payment Details */}
      {(order.shipping_address || order.payment_method) && (
        <View style={orderCardStyles.detailsSection}>
          {order.shipping_address && (
            <View style={orderCardStyles.detailRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.actionDescription}
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <ThemedText
                  style={[
                    orderCardStyles.detailLabel,
                    { color: colors.actionDescription },
                  ]}
                >
                  Shipping:
                </ThemedText>
                <ThemedText
                  style={[
                    orderCardStyles.detailValue,
                    { color: colors.bodyText },
                  ]}
                  numberOfLines={2}
                >
                  {order.shipping_address}
                </ThemedText>
              </View>
            </View>
          )}
          {order.payment_method && (
            <View style={orderCardStyles.detailRow}>
              <Ionicons
                name="card-outline"
                size={16}
                color={colors.actionDescription}
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <ThemedText
                  style={[
                    orderCardStyles.detailLabel,
                    { color: colors.actionDescription },
                  ]}
                >
                  Payment:
                </ThemedText>
                <ThemedText
                  style={[
                    orderCardStyles.detailValue,
                    { color: colors.bodyText },
                  ]}
                >
                  {order.payment_method}
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

interface OrderViewCaseViewProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onRefresh: () => void;
}

export function OrderViewCaseView({
  orders,
  isLoading,
  error,
  onBack,
  onRefresh,
}: OrderViewCaseViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard order={item} />
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header with back button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ThemedText
            type="subtitle"
            style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
          >
            Order View Case
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 13,
              color: colors.actionDescription,
              marginTop: 2,
            }}
          >
            Total orders: {orders.length}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (!isLoading) {
              onRefresh();
            }
          }}
          style={{ padding: 8 }}
          disabled={isLoading}
        >
          <Ionicons
            name="refresh"
            size={24}
            color={isLoading ? colors.actionDescription : supabaseGreen}
          />
        </TouchableOpacity>
      </View>

      {isLoading && orders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={supabaseGreen} />
          <ThemedText
            style={{
              color: colors.actionDescription,
              marginTop: 16,
            }}
          >
            Loading orders...
          </ThemedText>
        </View>
      ) : error ? (
        <ScrollView
          style={supabaseCasesScreenStyles.scrollView}
          contentContainerStyle={[
            supabaseCasesScreenStyles.scrollContent,
            { justifyContent: 'center', alignItems: 'center', minHeight: 400 },
          ]}
        >
          <View
            style={[
              supabaseCasesScreenStyles.card,
              {
                borderColor: '#ef4444',
                backgroundColor: '#ef444410',
              },
            ]}
          >
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <ThemedText
              style={{
                color: '#ef4444',
                fontWeight: '600',
                marginTop: 12,
                textAlign: 'center',
              }}
            >
              Error Loading Orders
            </ThemedText>
            <ThemedText
              style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              {error}
            </ThemedText>
          </View>
        </ScrollView>
      ) : orders.length === 0 ? (
        <ScrollView
          style={supabaseCasesScreenStyles.scrollView}
          contentContainerStyle={[
            supabaseCasesScreenStyles.scrollContent,
            { justifyContent: 'center', alignItems: 'center', minHeight: 400 },
          ]}
        >
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Ionicons name="receipt-outline" size={64} color={colors.actionDescription} />
            <ThemedText
              style={{
                color: colors.actionDescription,
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              No orders found
            </ThemedText>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            padding: 16,
          }}
          refreshing={isLoading}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

