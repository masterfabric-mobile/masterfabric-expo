import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ActivityIndicator, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { Product } from '../hooks/use-supabase-cases-view-model';
import { productCardStyles } from '../styles/product-card.styles';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const stockStatus = product.stock > 0 ? 'in_stock' : 'out_of_stock';
  const stockColor = product.stock > 10 ? supabaseGreen : product.stock > 0 ? '#FF9500' : '#ef4444';
  const stockText = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';

  return (
    <View
      style={[
        productCardStyles.card,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={productCardStyles.image}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            productCardStyles.imageContainer,
            { backgroundColor: colors.inputBackground || colors.surfaceBackground },
          ]}
        >
          <Ionicons
            name="image-outline"
            size={48}
            color={colors.actionDescription}
          />
        </View>
      )}

      <View style={productCardStyles.header}>
        <ThemedText
          style={[
            productCardStyles.brand,
            { color: colors.actionDescription },
          ]}
        >
          {product.brand}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={[
            productCardStyles.name,
            { color: colors.bodyText },
          ]}
          numberOfLines={2}
        >
          {product.name}
        </ThemedText>
        <ThemedText
          style={[
            productCardStyles.description,
            { color: colors.actionDescription },
          ]}
          numberOfLines={2}
        >
          {product.description}
        </ThemedText>
        <ThemedText
          style={[
            productCardStyles.category,
            { color: colors.actionDescription },
          ]}
        >
          {product.category}
        </ThemedText>
      </View>

      <View style={productCardStyles.footer}>
        <ThemedText
          style={[
            productCardStyles.price,
            { color: colors.bodyText },
          ]}
        >
          ${product.price.toFixed(2)}
        </ThemedText>
        <View style={productCardStyles.stockContainer}>
          <View
            style={[
              productCardStyles.stockBadge,
              {
                backgroundColor: stockColor + '15',
                borderWidth: 1,
                borderColor: stockColor + '30',
              },
            ]}
          >
            <ThemedText
              style={{
                color: stockColor,
                fontSize: 11,
                fontWeight: '600',
              }}
            >
              {stockText}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

interface ProductListCaseViewProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onRefresh: () => void;
}

export function ProductListCaseView({
  products,
  isLoading,
  error,
  onBack,
  onRefresh,
}: ProductListCaseViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
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
            Product List Case
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 13,
              color: colors.actionDescription,
              marginTop: 2,
            }}
          >
            Total products: {products.length}
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

      {isLoading && products.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={supabaseGreen} />
          <ThemedText
            style={{
              color: colors.actionDescription,
              marginTop: 16,
            }}
          >
            Loading products...
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
              Error Loading Products
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
      ) : products.length === 0 ? (
        <ScrollView
          style={supabaseCasesScreenStyles.scrollView}
          contentContainerStyle={[
            supabaseCasesScreenStyles.scrollContent,
            { justifyContent: 'center', alignItems: 'center', minHeight: 400 },
          ]}
        >
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Ionicons name="cube-outline" size={64} color={colors.actionDescription} />
            <ThemedText
              style={{
                color: colors.actionDescription,
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              No products found
            </ThemedText>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            padding: 16,
          }}
          numColumns={2}
          columnWrapperStyle={{
            gap: 16,
            marginBottom: 16,
          }}
          refreshing={isLoading}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

