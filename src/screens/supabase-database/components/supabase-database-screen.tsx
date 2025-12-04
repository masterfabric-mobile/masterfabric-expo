import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseDatabaseViewModel } from '../hooks/use-supabase-database-view-model';
import { supabaseDatabaseScreenStyles } from '../styles/supabase-database-screen.styles';

const supabaseGreen = '#3ECF8E';

export function SupabaseDatabaseScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { success, error } = useSnackbar();

  const { state, actions } = useSupabaseDatabaseViewModel();
  const [editingRecord, setEditingRecord] = useState<any>(null);

  useEffect(() => {
    console.log('[SupabaseDatabase] Screen mounted, initializing...');
    actions.refreshStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    try {
      await actions.createRecord();
      success('Record created successfully');
    } catch (e: any) {
      error(e?.message ?? 'Failed to create record');
    }
  };

  const handleUpdate = async (record: any) => {
    try {
      await actions.updateRecord(record.id);
      success('Record updated successfully');
      setEditingRecord(null);
    } catch (e: any) {
      error(e?.message ?? 'Failed to update record');
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await actions.deleteRecord(id);
      success('Record deleted successfully');
    } catch (e: any) {
      error(e?.message ?? 'Failed to delete record');
    }
  };

  return (
    <SafeAreaView 
      style={[supabaseDatabaseScreenStyles.container, { backgroundColor: colors.background }]} 
      edges={['top']}
    >
      <ScreenHeader 
        title="Supabase Database"
        subtitle="Database management and queries"
        variant="minimal"
      />
      <ScrollView 
        style={supabaseDatabaseScreenStyles.scrollView}
        contentContainerStyle={supabaseDatabaseScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Supabase Logo Header */}
        <View style={supabaseDatabaseScreenStyles.logoContainer}>
          <Image
            source={require('@/src/assets/images/supabase-logo-icon.svg')}
            style={supabaseDatabaseScreenStyles.logo}
            contentFit="contain"
          />
          <Text style={[supabaseDatabaseScreenStyles.logoTitle, { color: colors.sectionTitle }]}>
            Supabase
          </Text>
          <Text style={[supabaseDatabaseScreenStyles.logoSubtitle, { color: colors.actionDescription }]}>
            Database
          </Text>
        </View>

        {/* Status Card */}
        {!state.isReady ? (
          <View style={[supabaseDatabaseScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Database Status</Text>
            <ActivityIndicator size="small" color={supabaseGreen} />
            <Text style={[supabaseDatabaseScreenStyles.statusText, { color: colors.bodyText }]}>
              Initializing...
            </Text>
          </View>
        ) : !state.isConnected ? (
          <View style={[supabaseDatabaseScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Database Status</Text>
            <Text style={{ color: colors.bodyText }}>
              Not connected. Enable Supabase in initMasterView config and set Expo env vars in your .env (EXPO_PUBLIC_SUPABASE_*).
            </Text>
          </View>
        ) : (
          <View style={[supabaseDatabaseScreenStyles.card, { borderColor: supabaseGreen + '30', backgroundColor: colors.surfaceBackground }]}>
            <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Database Status</Text>
            <Text style={[supabaseDatabaseScreenStyles.statusText, { color: supabaseGreen, fontWeight: '600' }]}>
              ✓ Connected
            </Text>
            <Text style={[supabaseDatabaseScreenStyles.statusText, { color: colors.actionDescription, marginTop: 4 }]}>
              {state.tables.length} table{state.tables.length !== 1 ? 's' : ''} available
            </Text>
          </View>
        )}

        {/* Error Display */}
        {state.lastError && (
          <View style={[supabaseDatabaseScreenStyles.card, { borderColor: '#ef4444', backgroundColor: '#ef444410' }]}>
            <Text style={{ color: '#ef4444', fontWeight: '600', marginBottom: 4 }}>Error</Text>
            <Text style={{ color: '#ef4444', fontSize: 14 }}>{state.lastError}</Text>
          </View>
        )}

        {/* SQL Query Interface */}
        {state.isConnected && (
          <View style={[supabaseDatabaseScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <Text style={[supabaseDatabaseScreenStyles.sectionTitle, { color: colors.labelText }]}>
              SQL Query
            </Text>
            <View style={supabaseDatabaseScreenStyles.section}>
              <TextInput
                style={[
                  supabaseDatabaseScreenStyles.input,
                  { 
                    backgroundColor: colors.inputBackground || colors.surfaceBackground,
                    borderColor: colors.surfaceBorder,
                    color: colors.bodyText,
                  }
                ]}
                placeholder="SELECT * FROM table_name LIMIT 10;"
                placeholderTextColor={colors.actionDescription}
                value={state.query}
                onChangeText={actions.setQuery}
                multiline
                editable={!state.isQueryLoading}
              />
              <View style={supabaseDatabaseScreenStyles.actionButtons}>
                <TouchableOpacity
                  style={[
                    supabaseDatabaseScreenStyles.button,
                    supabaseDatabaseScreenStyles.buttonPrimary,
                    (!state.query.trim() || state.isQueryLoading) && supabaseDatabaseScreenStyles.buttonDisabled,
                    { backgroundColor: (!state.query.trim() || state.isQueryLoading) ? colors.surfaceBorder : supabaseGreen }
                  ]}
                  onPress={actions.executeQuery}
                  disabled={!state.query.trim() || state.isQueryLoading}
                >
                  {state.isQueryLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={supabaseDatabaseScreenStyles.buttonText}>Execute</Text>
                  )}
                </TouchableOpacity>
                {state.queryResult && (
                  <TouchableOpacity
                    style={[
                      supabaseDatabaseScreenStyles.button,
                      supabaseDatabaseScreenStyles.buttonSecondary,
                      { borderColor: colors.surfaceBorder, backgroundColor: 'transparent' }
                    ]}
                    onPress={actions.clearQueryResult}
                  >
                    <Text style={[supabaseDatabaseScreenStyles.buttonTextSecondary, { color: colors.bodyText }]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {state.queryError && (
                <View style={[supabaseDatabaseScreenStyles.queryResultContainer, { backgroundColor: '#ef444410', borderColor: '#ef4444' }]}>
                  <Text style={[supabaseDatabaseScreenStyles.queryResultText, { color: '#ef4444' }]}>
                    {state.queryError}
                  </Text>
                </View>
              )}
              {state.queryResult && (
                <View style={[supabaseDatabaseScreenStyles.queryResultContainer, { backgroundColor: colors.inputBackground || colors.surfaceBackground, borderColor: colors.surfaceBorder }]}>
                  <ScrollView nestedScrollEnabled>
                    <Text style={[supabaseDatabaseScreenStyles.queryResultText, { color: colors.bodyText }]}>
                      {JSON.stringify(state.queryResult, null, 2)}
                    </Text>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Table Browser */}
        {state.isConnected && (
          <View style={[supabaseDatabaseScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={[supabaseDatabaseScreenStyles.sectionTitle, { color: colors.labelText }]}>
                Tables
              </Text>
              <TouchableOpacity
                onPress={actions.fetchTables}
                style={{ padding: 8 }}
                disabled={state.isLoading}
              >
                <Ionicons name="refresh" size={20} color={state.isLoading ? colors.actionDescription : supabaseGreen} />
              </TouchableOpacity>
            </View>
            {state.isLoading ? (
              <ActivityIndicator size="small" color={supabaseGreen} />
            ) : (
              <>
                <View style={supabaseDatabaseScreenStyles.section}>
                  <Text style={[supabaseDatabaseScreenStyles.formLabel, { color: colors.labelText }]}>
                    Enter Table Name
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                      style={[
                        supabaseDatabaseScreenStyles.formInput,
                        { flex: 1, backgroundColor: colors.inputBackground || colors.surfaceBackground, borderColor: colors.surfaceBorder, color: colors.bodyText }
                      ]}
                      placeholder="e.g., users, posts, products"
                      placeholderTextColor={colors.actionDescription}
                      value={state.selectedTable || ''}
                      onChangeText={(text) => {
                        if (text.trim()) {
                          actions.selectTable(text.trim());
                        } else {
                          actions.selectTable('');
                        }
                      }}
                    />
                    {state.selectedTable && (
                      <TouchableOpacity
                        onPress={() => actions.selectTable('')}
                        style={{ padding: 12, justifyContent: 'center' }}
                      >
                        <Ionicons name="close-circle" size={20} color={colors.actionDescription} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {state.tables.length > 0 && (
                  <View style={supabaseDatabaseScreenStyles.tableList}>
                    {state.tables.map((table) => (
                      <TouchableOpacity
                        key={table}
                        onPress={() => actions.selectTable(table)}
                        style={[
                          supabaseDatabaseScreenStyles.tableItem,
                          { 
                            backgroundColor: state.selectedTable === table ? supabaseGreen + '15' : colors.inputBackground || colors.surfaceBackground,
                            borderWidth: state.selectedTable === table ? 1.5 : 0,
                            borderColor: supabaseGreen + '30',
                          }
                        ]}
                      >
                        <Ionicons name="table" size={20} color={supabaseGreen} />
                        <Text style={[supabaseDatabaseScreenStyles.tableItemText, { color: colors.bodyText }]}>
                          {table}
                        </Text>
                        {state.selectedTable === table && (
                          <Ionicons name="checkmark-circle" size={20} color={supabaseGreen} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Table Data Display */}
        {state.isConnected && state.selectedTable && state.crudMode === 'read' && (
          <View style={[supabaseDatabaseScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={[supabaseDatabaseScreenStyles.sectionTitle, { color: colors.labelText }]}>
                {state.selectedTable} Data
              </Text>
              <View style={supabaseDatabaseScreenStyles.actionButtons}>
                <TouchableOpacity
                  onPress={() => {
                    actions.setCrudMode('create');
                    actions.setFormData({});
                  }}
                  style={[
                    supabaseDatabaseScreenStyles.button,
                    { backgroundColor: supabaseGreen, paddingHorizontal: 12, paddingVertical: 8, minHeight: 36 }
                  ]}
                >
                  <Text style={[supabaseDatabaseScreenStyles.buttonText, { fontSize: 14 }]}>+ Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={actions.fetchTableData}
                  style={{ padding: 8 }}
                  disabled={state.isLoading}
                >
                  <Ionicons name="refresh" size={20} color={state.isLoading ? colors.actionDescription : supabaseGreen} />
                </TouchableOpacity>
              </View>
            </View>
            {state.isLoading ? (
              <ActivityIndicator size="small" color={supabaseGreen} />
            ) : state.tableData.length === 0 ? (
              <View style={supabaseDatabaseScreenStyles.emptyState}>
                <Text style={[supabaseDatabaseScreenStyles.emptyStateText, { color: colors.actionDescription }]}>
                  No data found in this table.
                </Text>
              </View>
            ) : (
              <ScrollView 
                horizontal
                style={supabaseDatabaseScreenStyles.tableDataContainer}
                showsHorizontalScrollIndicator={true}
              >
                <View>
                  {/* Header */}
                  <View style={[supabaseDatabaseScreenStyles.tableRow, supabaseDatabaseScreenStyles.tableHeader, { backgroundColor: supabaseGreen + '15' }]}>
                    {state.tableColumns.map((col) => (
                      <View key={col} style={{ width: 150, paddingHorizontal: 8 }}>
                        <Text style={[supabaseDatabaseScreenStyles.tableCell, { color: colors.labelText }]}>
                          {col}
                        </Text>
                      </View>
                    ))}
                    <View style={{ width: 100, paddingHorizontal: 8 }}>
                      <Text style={[supabaseDatabaseScreenStyles.tableCell, { color: colors.labelText }]}>
                        Actions
                      </Text>
                    </View>
                  </View>
                  {/* Rows */}
                  {state.tableData.map((row, idx) => (
                    <View key={idx} style={[supabaseDatabaseScreenStyles.tableRow, { backgroundColor: idx % 2 === 0 ? colors.surfaceBackground : colors.inputBackground || colors.surfaceBackground }]}>
                      {state.tableColumns.map((col) => (
                        <View key={col} style={{ width: 150, paddingHorizontal: 8 }}>
                          <Text style={[supabaseDatabaseScreenStyles.tableCell, { color: colors.bodyText }]} numberOfLines={1}>
                            {String(row[col] ?? 'null')}
                          </Text>
                        </View>
                      ))}
                      <View style={{ width: 100, paddingHorizontal: 8, flexDirection: 'row', gap: 4 }}>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingRecord(row);
                            actions.setFormData(row);
                            actions.setCrudMode('update');
                          }}
                        >
                          <Ionicons name="create-outline" size={18} color={supabaseGreen} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(row.id)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        )}

        {/* CRUD Form */}
        {state.isConnected && state.selectedTable && state.crudMode && state.crudMode !== 'read' && (
          <View style={[supabaseDatabaseScreenStyles.card, { borderColor: supabaseGreen + '20', backgroundColor: colors.surfaceBackground }]}>
            <Text style={[supabaseDatabaseScreenStyles.sectionTitle, { color: colors.labelText }]}>
              {state.crudMode === 'create' ? 'Create New Record' : 'Update Record'}
            </Text>
            <View style={supabaseDatabaseScreenStyles.crudForm}>
              {state.tableColumns.filter(col => col !== 'id' && col !== 'created_at' && col !== 'updated_at').map((col) => (
                <View key={col} style={supabaseDatabaseScreenStyles.formField}>
                  <Text style={[supabaseDatabaseScreenStyles.formLabel, { color: colors.labelText }]}>
                    {col}
                  </Text>
                  <TextInput
                    style={[
                      supabaseDatabaseScreenStyles.formInput,
                      { 
                        backgroundColor: colors.inputBackground || colors.surfaceBackground,
                        borderColor: colors.surfaceBorder,
                        color: colors.bodyText,
                      }
                    ]}
                    placeholder={`Enter ${col}`}
                    placeholderTextColor={colors.actionDescription}
                    value={state.formData[col]?.toString() || ''}
                    onChangeText={(text) => {
                      actions.setFormData({ ...state.formData, [col]: text });
                    }}
                  />
                </View>
              ))}
              <View style={supabaseDatabaseScreenStyles.actionButtons}>
                <TouchableOpacity
                  style={[
                    supabaseDatabaseScreenStyles.button,
                    supabaseDatabaseScreenStyles.buttonPrimary,
                    state.isLoading && supabaseDatabaseScreenStyles.buttonDisabled,
                    { backgroundColor: state.isLoading ? colors.surfaceBorder : supabaseGreen }
                  ]}
                  onPress={() => {
                    if (state.crudMode === 'create') {
                      handleCreate();
                    } else if (state.crudMode === 'update' && editingRecord) {
                      handleUpdate(editingRecord);
                    }
                  }}
                  disabled={state.isLoading}
                >
                  {state.isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={supabaseDatabaseScreenStyles.buttonText}>
                      {state.crudMode === 'create' ? 'Create' : 'Update'}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    supabaseDatabaseScreenStyles.button,
                    supabaseDatabaseScreenStyles.buttonSecondary,
                    { borderColor: colors.surfaceBorder, backgroundColor: 'transparent' }
                  ]}
                  onPress={() => {
                    actions.setCrudMode('read');
                    actions.setFormData({});
                    setEditingRecord(null);
                  }}
                >
                  <Text style={[supabaseDatabaseScreenStyles.buttonTextSecondary, { color: colors.bodyText }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SupabaseDatabaseScreen;

