import { getCurrentLocale, t } from '@/src/shared/i18n';
import { isIOS, urlLauncherHelper } from 'masterfabric-expo-core';
import { useCallback, useEffect } from 'react';
import { UrlLaunchResult, UrlTestInput } from '../models/url-launcher-helper-models';
import { useUrlLauncherHelperStore } from '../store/url-launcher-helper-store';

export function useUrlLauncherHelperViewModel() {
  const { 
    testInput, 
    testResults, 
    isLoading,
    history,
    updateTestInput: updateTestInputStore,
    setTestResults, 
    setIsLoading,
    addToHistory,
    clearResults,
    addQueryParameter,
    updateQueryParameter,
    removeQueryParameter,
  } = useUrlLauncherHelperStore();

  // Track locale to update defaults when language changes
  const currentLocale = getCurrentLocale();
  
  // Initialize default values from i18n on mount and when language changes
  useEffect(() => {
    // Initialize all default values from i18n
    // This ensures that default values are always in the current language
    updateTestInputStore({
      url: t('helpers.urlLauncherHelper.defaultValues.url'),
      email: t('helpers.urlLauncherHelper.defaultValues.email'),
      phone: t('helpers.urlLauncherHelper.defaultValues.phone'),
      smsRecipients: t('helpers.urlLauncherHelper.defaultValues.smsRecipients'),
      smsBody: t('helpers.urlLauncherHelper.defaultValues.smsBody'),
      mapAddress: t('helpers.urlLauncherHelper.defaultValues.mapAddress'),
      mapLabel: t('helpers.urlLauncherHelper.defaultValues.mapLabel'),
      emailSubject: t('helpers.urlLauncherHelper.defaultValues.emailSubject'),
      emailBody: t('helpers.urlLauncherHelper.defaultValues.emailBody'),
      deepLinkUrl: t('helpers.urlLauncherHelper.defaultValues.deepLinkUrl'),
      fallbackUrl: t('helpers.urlLauncherHelper.defaultValues.fallbackUrl'),
      appStoreId: t('helpers.urlLauncherHelper.defaultValues.appStoreId'),
    });
  }, [currentLocale, updateTestInputStore]);

  const runAllTests = useCallback(async () => {
    setIsLoading(true);
    
    const results: UrlLaunchResult[] = [];
    const timestamp = Date.now();

    // URL Validation - always runs
    try {
      const isValidUrl = urlLauncherHelper.validateUrl(testInput.url);
      results.push({
        id: 'validateUrl',
        functionName: 'validateUrl',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.empty'),
        output: isValidUrl ? t('helpers.urlLauncherHelper.messages.true') : t('helpers.urlLauncherHelper.messages.false'),
        success: true,
        description: t('helpers.urlLauncherHelper.validateUrl'),
        timestamp,
      });
    } catch (error) {
      results.push({
        id: 'validateUrl',
        functionName: 'validateUrl',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.empty'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.validateUrl'),
        timestamp,
      });
    }

    // Normalize URL - always runs
    try {
      const normalizedUrl = urlLauncherHelper.normalizeUrl(testInput.url);
      results.push({
        id: 'normalizeUrl',
        functionName: 'normalizeUrl',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.empty'),
        output: normalizedUrl || t('helpers.urlLauncherHelper.messages.empty'),
        success: true,
        description: t('helpers.urlLauncherHelper.normalizeUrl'),
        timestamp,
      });
    } catch (error) {
      results.push({
        id: 'normalizeUrl',
        functionName: 'normalizeUrl',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.empty'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.normalizeUrl'),
        timestamp,
      });
    }

    // Parse URL - always runs (even for invalid URLs)
    try {
      const parsedUrl = urlLauncherHelper.parseUrl(testInput.url);
      results.push({
        id: 'parseUrl',
        functionName: 'parseUrl',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.empty'),
        output: parsedUrl ? JSON.stringify(parsedUrl, null, 2) : 'null',
        success: !!parsedUrl,
        description: t('helpers.urlLauncherHelper.parseUrl'),
        timestamp,
      });
    } catch (error) {
      results.push({
        id: 'parseUrl',
        functionName: 'parseUrl',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.empty'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.parseUrl'),
        timestamp,
      });
    }

    // Can Open URL - only runs if URL is provided
    try {
      if (testInput.url && testInput.url.trim().length > 0) {
        const canOpen = await urlLauncherHelper.canOpenUrl(testInput.url);
        results.push({
          id: 'canOpenUrl',
          functionName: 'canOpenUrl',
          input: testInput.url,
          output: canOpen ? t('helpers.urlLauncherHelper.messages.true') : t('helpers.urlLauncherHelper.messages.false'),
          success: true,
          description: t('helpers.urlLauncherHelper.canOpenUrl'),
          timestamp,
        });
      } else {
        results.push({
          id: 'canOpenUrl',
          functionName: 'canOpenUrl',
          input: t('helpers.urlLauncherHelper.messages.empty'),
          output: t('helpers.urlLauncherHelper.messages.naUrlRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.canOpenUrl'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'canOpenUrl',
        functionName: 'canOpenUrl',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.empty'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.canOpenUrl'),
        timestamp,
      });
    }

    // Get Supported Schemes - always runs
    try {
      const schemes = urlLauncherHelper.getSupportedSchemes();
      results.push({
        id: 'getSupportedSchemes',
        functionName: 'getSupportedSchemes',
        input: '',
        output: schemes.join(', '),
        success: true,
        description: t('helpers.urlLauncherHelper.getSupportedSchemes'),
        timestamp,
      });
    } catch (error) {
      results.push({
        id: 'getSupportedSchemes',
        functionName: 'getSupportedSchemes',
        input: '',
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.getSupportedSchemes'),
        timestamp,
      });
    }

    // Build URL with params - only runs if URL is provided
    try {
      if (testInput.url && testInput.url.trim().length > 0) {
        // Normalize URL first to ensure it's valid
        const normalizedUrl = urlLauncherHelper.normalizeUrl(testInput.url);
        const builtUrl = urlLauncherHelper.buildUrl(normalizedUrl, { 
          test: 'value',
          param: '123'
        });
        results.push({
          id: 'buildUrl',
          functionName: 'buildUrl',
          input: `${testInput.url} + { test: 'value', param: '123' }`,
          output: builtUrl,
          success: true,
          description: t('helpers.urlLauncherHelper.buildUrl'),
          timestamp,
        });
      } else {
        results.push({
          id: 'buildUrl',
          functionName: 'buildUrl',
          input: t('helpers.urlLauncherHelper.messages.empty'),
          output: t('helpers.urlLauncherHelper.messages.naUrlRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.buildUrl'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'buildUrl',
        functionName: 'buildUrl',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.empty'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.buildUrl'),
        timestamp,
      });
    }

    // Email test - always runs (shows N/A if empty, but allows subject/body only)
    try {
      const hasEmail = testInput.email && testInput.email.trim().length > 0;
      const hasSubject = testInput.emailSubject && testInput.emailSubject.trim().length > 0;
      const hasBody = testInput.emailBody && testInput.emailBody.trim().length > 0;
      const canLaunch = hasEmail || hasSubject || hasBody;
      
      if (canLaunch) {
        let mailtoUrl = hasEmail ? `mailto:${encodeURIComponent(testInput.email || '')}` : 'mailto:';
        const params: string[] = [];
        if (hasSubject) {
          params.push(`subject=${encodeURIComponent(testInput.emailSubject || '')}`);
        }
        if (hasBody) {
          params.push(`body=${encodeURIComponent(testInput.emailBody || '')}`);
        }
        if (testInput.emailCc) {
          params.push(`cc=${encodeURIComponent(testInput.emailCc)}`);
        }
        if (testInput.emailBcc) {
          params.push(`bcc=${encodeURIComponent(testInput.emailBcc)}`);
        }
        if (params.length > 0) {
          mailtoUrl += `?${params.join('&')}`;
        }
        
        results.push({
          id: 'openEmail',
          functionName: 'openEmail',
          input: hasEmail 
            ? `${testInput.email}${hasSubject ? ` (subject: ${testInput.emailSubject})` : ''}${hasBody ? ` (body: ${testInput.emailBody})` : ''}`
            : `${hasSubject ? `subject: ${testInput.emailSubject}` : ''}${hasBody ? ` body: ${testInput.emailBody}` : ''}`,
          output: mailtoUrl,
          success: true,
          description: t('helpers.urlLauncherHelper.openEmailDescription'),
          timestamp,
        });
      } else {
        results.push({
          id: 'openEmail',
          functionName: 'openEmail',
          input: t('helpers.urlLauncherHelper.messages.notProvided'),
          output: t('helpers.urlLauncherHelper.messages.naEmailRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.openEmailDescription'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'openEmail',
        functionName: 'openEmail',
        input: testInput.email || testInput.emailSubject || testInput.emailBody || t('helpers.urlLauncherHelper.messages.notProvided'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.openEmail'),
        timestamp,
      });
    }

    // Phone test - always runs (shows N/A if empty)
    try {
      if (testInput.phone) {
        const phoneUrl = `tel:${testInput.phone.replace(/[^\d+\- ]/g, '')}`;
        results.push({
          id: 'openPhone',
          functionName: 'openPhone',
          input: testInput.phone,
          output: phoneUrl,
          success: true,
          description: t('helpers.urlLauncherHelper.openPhoneDescription'),
          timestamp,
        });
      } else {
        results.push({
          id: 'openPhone',
          functionName: 'openPhone',
          input: t('helpers.urlLauncherHelper.messages.notProvided'),
          output: t('helpers.urlLauncherHelper.messages.naPhoneRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.openPhoneDescription'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'openPhone',
        functionName: 'openPhone',
        input: testInput.phone || t('helpers.urlLauncherHelper.messages.notProvided'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.openPhone'),
        timestamp,
      });
    }

    // SMS test - always runs (shows N/A if empty)
    try {
      if (testInput.smsRecipients) {
        const smsUrl = testInput.smsBody 
          ? `sms:${testInput.smsRecipients}?body=${encodeURIComponent(testInput.smsBody)}`
          : `sms:${testInput.smsRecipients}`;
        results.push({
          id: 'openSMS',
          functionName: 'openSMS',
          input: `${testInput.smsRecipients} (body: ${testInput.smsBody || ''})`,
          output: smsUrl,
          success: true,
          description: t('helpers.urlLauncherHelper.openSMSDescription'),
          timestamp,
        });
      } else {
        results.push({
          id: 'openSMS',
          functionName: 'openSMS',
          input: t('helpers.urlLauncherHelper.messages.notProvided'),
          output: t('helpers.urlLauncherHelper.messages.naSmsRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.openSMSDescription'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'openSMS',
        functionName: 'openSMS',
        input: testInput.smsRecipients || t('helpers.urlLauncherHelper.messages.notProvided'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.openSMS'),
        timestamp,
      });
    }

    // Map test - always runs (shows N/A if empty)
    try {
      if (testInput.mapAddress || (testInput.mapLatitude && testInput.mapLongitude)) {
        let mapInput: string;
        let mapUrl: string;
        
        if (testInput.mapAddress) {
          mapInput = testInput.mapAddress;
          mapUrl = `geo:0,0?q=${encodeURIComponent(testInput.mapAddress)}`;
        } else {
          mapInput = `${testInput.mapLatitude}, ${testInput.mapLongitude}`;
          mapUrl = `geo:${testInput.mapLatitude},${testInput.mapLongitude}`;
        }
        
        results.push({
          id: 'openMap',
          functionName: 'openMap',
          input: mapInput,
          output: mapUrl,
          success: true,
          description: t('helpers.urlLauncherHelper.openMapDescription'),
          timestamp,
        });
      } else {
        results.push({
          id: 'openMap',
          functionName: 'openMap',
          input: t('helpers.urlLauncherHelper.messages.notProvided'),
          output: t('helpers.urlLauncherHelper.messages.naMapRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.openMapDescription'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'openMap',
        functionName: 'openMap',
        input: testInput.mapAddress || (testInput.mapLatitude && testInput.mapLongitude ? `${testInput.mapLatitude}, ${testInput.mapLongitude}` : t('helpers.urlLauncherHelper.messages.notProvided')),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.openMap'),
        timestamp,
      });
    }

    // Deep Link test - always runs (shows N/A if empty)
    try {
      if (testInput.deepLinkUrl) {
        const deepLinkInput = `${testInput.deepLinkUrl}${testInput.fallbackUrl ? ` (fallback: ${testInput.fallbackUrl})` : ''}`;
        results.push({
          id: 'openDeepLink',
          functionName: 'openDeepLink',
          input: deepLinkInput,
          output: testInput.deepLinkUrl,
          success: true,
          description: t('helpers.urlLauncherHelper.openDeepLink'),
          timestamp,
        });
      } else {
        results.push({
          id: 'openDeepLink',
          functionName: 'openDeepLink',
          input: t('helpers.urlLauncherHelper.messages.notProvided'),
          output: t('helpers.urlLauncherHelper.messages.naDeepLinkRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.openDeepLink'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'openDeepLink',
        functionName: 'openDeepLink',
        input: testInput.deepLinkUrl || t('helpers.urlLauncherHelper.messages.notProvided'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.openDeepLink'),
        timestamp,
      });
    }

    // App Store test - always runs (shows N/A if empty)
    try {
      if (testInput.appStoreId) {
        const isIOSPlatform = isIOS();
        const appStoreUrl = isIOSPlatform
          ? `itms-apps://apps.apple.com/app/id${testInput.appStoreId}${testInput.appStoreReview ? '?action=write-review' : ''}`
          : `market://details?id=${testInput.appStoreId}`;
        results.push({
          id: 'openAppStore',
          functionName: 'openAppStore',
          input: `${testInput.appStoreId}${testInput.appStoreReview ? ` (review: ${t('helpers.urlLauncherHelper.messages.true')})` : ''}`,
          output: appStoreUrl,
          success: true,
          description: t('helpers.urlLauncherHelper.openAppStore'),
          timestamp,
        });
      } else {
        results.push({
          id: 'openAppStore',
          functionName: 'openAppStore',
          input: t('helpers.urlLauncherHelper.messages.notProvided'),
          output: t('helpers.urlLauncherHelper.messages.naAppStoreRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.openAppStore'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'openAppStore',
        functionName: 'openAppStore',
        input: testInput.appStoreId || t('helpers.urlLauncherHelper.messages.notProvided'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.openAppStore'),
        timestamp,
      });
    }

    // Settings test - always runs
    try {
      const section = testInput.settingsSection || 'general';
      const isIOSPlatform = isIOS();
      const settingsUrl = isIOSPlatform
        ? 'app-settings:'
        : `android.settings.${section === 'app' ? 'APPLICATION_DETAILS_SETTINGS' : 'SETTINGS'}`;
      results.push({
        id: 'openSettings',
        functionName: 'openSettings',
        input: section,
        output: settingsUrl,
        success: true,
        description: t('helpers.urlLauncherHelper.openSettings'),
        timestamp,
      });
    } catch (error) {
      results.push({
        id: 'openSettings',
        functionName: 'openSettings',
        input: testInput.settingsSection || 'general',
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.openSettings'),
        timestamp,
      });
    }

    // In Browser test - always runs (shows N/A if empty)
    try {
      if (testInput.url && testInput.url.trim().length > 0) {
        const normalizedUrl = urlLauncherHelper.normalizeUrl(testInput.url);
        results.push({
          id: 'openInBrowser',
          functionName: 'openInBrowser',
          input: testInput.url,
          output: normalizedUrl,
          success: true,
          description: t('helpers.urlLauncherHelper.openInBrowser'),
          timestamp,
        });
      } else {
        results.push({
          id: 'openInBrowser',
          functionName: 'openInBrowser',
          input: t('helpers.urlLauncherHelper.messages.notProvided'),
          output: t('helpers.urlLauncherHelper.messages.naUrlRequired'),
          success: false,
          description: t('helpers.urlLauncherHelper.openInBrowser'),
          timestamp,
        });
      }
    } catch (error) {
      results.push({
        id: 'openInBrowser',
        functionName: 'openInBrowser',
        input: testInput.url || t('helpers.urlLauncherHelper.messages.notProvided'),
        output: `${t('helpers.urlLauncherHelper.messages.error')}: ${error instanceof Error ? error.message : t('helpers.urlLauncherHelper.messages.unknownError')}`,
        success: false,
        description: t('helpers.urlLauncherHelper.openInBrowser'),
        timestamp,
      });
    }

    setTestResults(results);
    setIsLoading(false);
  }, [testInput, setTestResults, setIsLoading]);

  const updateTestInput = useCallback((updates: Partial<UrlTestInput>) => {
    updateTestInputStore(updates);
  }, [updateTestInputStore]);

  const launchUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    let finalUrl = url;
    let errorMessage = '';
    
    try {
      // Normalize URL to get final URI
      finalUrl = urlLauncherHelper.normalizeUrl(url);
      const result = await urlLauncherHelper.openUrl(url);
      
      const launchResult: UrlLaunchResult = {
        id: `launch-${Date.now()}`,
        functionName: 'openUrl',
        input: finalUrl,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} ${t('helpers.urlLauncherHelper.messages.url')}: ${finalUrl})`,
        success: result,
        description: t('helpers.urlLauncherHelper.openUrl'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `launch-${Date.now()}`,
        functionName: 'openUrl',
        input: finalUrl,
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openUrl'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [setIsLoading, addToHistory]);

  const launchEmail = useCallback(async () => {
    // Allow launch if email OR subject/body provided
    const canLaunch = testInput.email || testInput.emailSubject || testInput.emailBody;
    if (!canLaunch) return false;
    
    setIsLoading(true);
    let finalUri = '';
    let errorMessage = '';
    
    try {
      // Build final URI
      const hasRecipient = testInput.email && testInput.email.trim().length > 0;
      let mailtoUrl = hasRecipient 
        ? `mailto:${encodeURIComponent(testInput.email || '')}`
        : 'mailto:';
      
      const params: string[] = [];
      if (testInput.emailSubject) {
        params.push(`subject=${encodeURIComponent(testInput.emailSubject)}`);
      }
      if (testInput.emailBody) {
        params.push(`body=${encodeURIComponent(testInput.emailBody)}`);
      }
      if (testInput.emailCc) {
        params.push(`cc=${encodeURIComponent(testInput.emailCc)}`);
      }
      if (testInput.emailBcc) {
        params.push(`bcc=${encodeURIComponent(testInput.emailBcc)}`);
      }
      if (params.length > 0) {
        mailtoUrl += `?${params.join('&')}`;
      }
      finalUri = mailtoUrl;
      
      // Parse CC and BCC from comma-separated strings
      const ccArray = testInput.emailCc ? testInput.emailCc.split(',').map(e => e.trim()).filter(Boolean) : undefined;
      const bccArray = testInput.emailBcc ? testInput.emailBcc.split(',').map(e => e.trim()).filter(Boolean) : undefined;
      
      const result = await urlLauncherHelper.openEmail(testInput.email || '', {
        subject: testInput.emailSubject,
        body: testInput.emailBody,
        cc: ccArray,
        bcc: bccArray,
      });
      
      const launchResult: UrlLaunchResult = {
        id: `email-${Date.now()}`,
        functionName: 'openEmail',
        input: finalUri,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} mailto: URI)`,
        success: result,
        description: t('helpers.urlLauncherHelper.openEmail'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `email-${Date.now()}`,
        functionName: 'openEmail',
        input: finalUri || `mailto:${testInput.email || ''}`,
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openEmail'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [testInput, setIsLoading, addToHistory]);

  const launchPhone = useCallback(async () => {
    if (!testInput.phone) return false;
    setIsLoading(true);
    let finalUri = '';
    let errorMessage = '';
    
    try {
      // Build final URI
      const cleanedNumber = testInput.phone.replace(/[^\d+\- ]/g, '').trim();
      finalUri = `tel:${cleanedNumber}`;
      
      const result = await urlLauncherHelper.openPhone(testInput.phone);
      
      const launchResult: UrlLaunchResult = {
        id: `phone-${Date.now()}`,
        functionName: 'openPhone',
        input: finalUri,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} tel: URI)`,
        success: result,
        description: t('helpers.urlLauncherHelper.openPhone'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `phone-${Date.now()}`,
        functionName: 'openPhone',
        input: finalUri || `tel:${testInput.phone}`,
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openPhone'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [testInput, setIsLoading, addToHistory]);

  const launchSMS = useCallback(async () => {
    if (!testInput.smsRecipients) return false;
    setIsLoading(true);
    let finalUri = '';
    let errorMessage = '';
    
    try {
      // Build final URI
      const recipientString = testInput.smsRecipients;
      let smsUrl = `sms:${recipientString}`;
      if (testInput.smsBody) {
        smsUrl += `?body=${encodeURIComponent(testInput.smsBody)}`;
      }
      finalUri = smsUrl;
      
      const result = await urlLauncherHelper.openSMS(
        testInput.smsRecipients,
        { body: testInput.smsBody }
      );
      
      const launchResult: UrlLaunchResult = {
        id: `sms-${Date.now()}`,
        functionName: 'openSMS',
        input: finalUri,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} sms: URI)`,
        success: result,
        description: t('helpers.urlLauncherHelper.openSMS'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `sms-${Date.now()}`,
        functionName: 'openSMS',
        input: finalUri || `sms:${testInput.smsRecipients}`,
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openSMS'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [testInput, setIsLoading, addToHistory]);

  const launchMap = useCallback(async () => {
    setIsLoading(true);
    let result = false;
    let finalUri = '';
    let errorMessage = '';
    
    try {
      if (testInput.mapAddress) {
        // Address-based: geo:0,0?q=address
        finalUri = `geo:0,0?q=${encodeURIComponent(testInput.mapAddress)}`;
        result = await urlLauncherHelper.openMap(testInput.mapAddress, {
          label: testInput.mapLabel,
        });
      } else if (testInput.mapLatitude && testInput.mapLongitude) {
        // Coordinate-based: geo:lat,lng or geo:lat,lng(label)
        if (testInput.mapLabel) {
          finalUri = `geo:${testInput.mapLatitude},${testInput.mapLongitude}(${encodeURIComponent(testInput.mapLabel)})`;
        } else {
          finalUri = `geo:${testInput.mapLatitude},${testInput.mapLongitude}`;
        }
        result = await urlLauncherHelper.openMap(
          { latitude: testInput.mapLatitude, longitude: testInput.mapLongitude },
          { label: testInput.mapLabel }
        );
      } else {
        setIsLoading(false);
        return false;
      }
      
      const launchResult: UrlLaunchResult = {
        id: `map-${Date.now()}`,
        functionName: 'openMap',
        input: finalUri,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} geo: URI)`,
        success: result,
        description: t('helpers.urlLauncherHelper.openMap'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `map-${Date.now()}`,
        functionName: 'openMap',
        input: finalUri || (testInput.mapAddress || `${testInput.mapLatitude},${testInput.mapLongitude}`),
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openMap'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [testInput, setIsLoading, addToHistory]);

  const launchInBrowser = useCallback(async () => {
    if (!testInput.url) return false;
    setIsLoading(true);
    let finalUrl = testInput.url;
    let errorMessage = '';
    
    try {
      // Normalize URL to get final URI
      finalUrl = urlLauncherHelper.normalizeUrl(testInput.url);
      const result = await urlLauncherHelper.openInBrowser(testInput.url);
      
      const launchResult: UrlLaunchResult = {
        id: `browser-${Date.now()}`,
        functionName: 'openInBrowser',
        input: finalUrl,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} ${t('helpers.urlLauncherHelper.messages.url')}: ${finalUrl})`,
        success: result,
        description: t('helpers.urlLauncherHelper.openInBrowser'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `browser-${Date.now()}`,
        functionName: 'openInBrowser',
        input: finalUrl,
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openInBrowser'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [testInput, setIsLoading, addToHistory]);

  const launchAppStore = useCallback(async () => {
    if (!testInput.appStoreId) return false;
    setIsLoading(true);
    let finalUri = '';
    let errorMessage = '';
    
    try {
      // Build final URI based on platform
      finalUri = isIOS() 
        ? `itms-apps://apps.apple.com/app/id${testInput.appStoreId}${testInput.appStoreReview ? '?action=write-review' : ''}`
        : `market://details?id=${testInput.appStoreId}`;
      
      const result = await urlLauncherHelper.openAppStore(testInput.appStoreId, {
        review: testInput.appStoreReview,
      });
      
      const launchResult: UrlLaunchResult = {
        id: `appstore-${Date.now()}`,
        functionName: 'openAppStore',
        input: finalUri,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} app store URI: ${finalUri})`,
        success: result,
        description: t('helpers.urlLauncherHelper.openAppStore'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `appstore-${Date.now()}`,
        functionName: 'openAppStore',
        input: finalUri || testInput.appStoreId,
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openAppStore'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [testInput, setIsLoading, addToHistory]);

  const launchSettings = useCallback(async () => {
    setIsLoading(true);
    let finalUri = '';
    let errorMessage = '';
    
    try {
      // Build final URI based on platform
      const section = testInput.settingsSection || 'general';
      finalUri = isIOS() 
        ? `app-settings:`
        : `android.settings.${section === 'app' ? 'APPLICATION_DETAILS_SETTINGS' : 'SETTINGS'}`;
      
      const result = await urlLauncherHelper.openSettings({
        section: testInput.settingsSection,
      });
      
      const launchResult: UrlLaunchResult = {
        id: `settings-${Date.now()}`,
        functionName: 'openSettings',
        input: finalUri || section,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} settings URI: ${finalUri})`,
        success: result,
        description: t('helpers.urlLauncherHelper.openSettings'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `settings-${Date.now()}`,
        functionName: 'openSettings',
        input: finalUri || (testInput.settingsSection || 'general'),
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openSettings'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [testInput, setIsLoading, addToHistory]);

  const launchDeepLink = useCallback(async () => {
    if (!testInput.deepLinkUrl) return false;
    setIsLoading(true);
    let finalUri = testInput.deepLinkUrl;
    let errorMessage = '';
    
    try {
      const result = await urlLauncherHelper.openDeepLink(testInput.deepLinkUrl, {
        fallbackUrl: testInput.fallbackUrl,
      });
      
      const launchResult: UrlLaunchResult = {
        id: `deeplink-${Date.now()}`,
        functionName: 'openDeepLink',
        input: `${finalUri}${testInput.fallbackUrl ? ` (fallback: ${testInput.fallbackUrl})` : ''}`,
        output: result ? t('helpers.urlLauncherHelper.messages.success') : `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${t('helpers.urlLauncherHelper.messages.noApplicationFound')} deep link: ${finalUri}${testInput.fallbackUrl ? `, ${t('helpers.urlLauncherHelper.messages.fallbackAlsoFailed')}: ${testInput.fallbackUrl}` : ''})`,
        success: result,
        description: t('helpers.urlLauncherHelper.openDeepLink'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const launchResult: UrlLaunchResult = {
        id: `deeplink-${Date.now()}`,
        functionName: 'openDeepLink',
        input: `${finalUri}${testInput.fallbackUrl ? ` (fallback: ${testInput.fallbackUrl})` : ''}`,
        output: `${t('helpers.urlLauncherHelper.messages.failure')} - (${t('helpers.urlLauncherHelper.messages.error')}: ${errorMessage})`,
        success: false,
        description: t('helpers.urlLauncherHelper.openDeepLink'),
        timestamp: Date.now(),
      };
      addToHistory(launchResult);
      setIsLoading(false);
      return false;
    }
  }, [testInput, setIsLoading, addToHistory]);

  const buildUrlWithParams = useCallback(() => {
    if (!testInput.url) return testInput.url;
    try {
      const params: Record<string, string> = {};
      (testInput.queryParameters || []).forEach((param) => {
        if (param.key && param.value) {
          params[param.key] = param.value;
        }
      });
      if (Object.keys(params).length > 0) {
        return urlLauncherHelper.buildUrl(testInput.url, params);
      }
      return testInput.url;
    } catch (error) {
      console.error('Error building URL:', error);
      return testInput.url;
    }
  }, [testInput]);

  const reLaunchFromHistory = useCallback(async (result: UrlLaunchResult) => {
    setIsLoading(true);
    
    try {
      // Re-launch using the INPUT value (final URI) directly
      // Parse based on function name to use the correct launch function
      if (result.input) {
        switch (result.functionName) {
          case 'openUrl':
            // For openUrl, use launchUrl directly
            await launchUrl(result.input);
            break;
          case 'openEmail':
            // Parse mailto: URI
            if (result.input.startsWith('mailto:')) {
              const mailtoMatch = result.input.match(/^mailto:(.*?)(\?|$)/);
              const email = mailtoMatch ? decodeURIComponent(mailtoMatch[1]) : '';
              const params = new URLSearchParams(result.input.split('?')[1] || '');
              const subject = params.get('subject') || '';
              const body = params.get('body') || '';
              // CC and BCC are comma-separated in URI, parse them correctly
              const cc = params.get('cc') || '';
              const bcc = params.get('bcc') || '';
              updateTestInput({ email, emailSubject: subject, emailBody: body, emailCc: cc, emailBcc: bcc });
              await launchEmail();
            } else {
              // If not a mailto: URI, try as regular URL
              await launchUrl(result.input);
            }
            break;
          case 'openPhone':
            // Parse tel: URI and launch directly
            if (result.input.startsWith('tel:') || result.input.startsWith('telprompt:')) {
              // Extract phone number from URI (remove tel: or telprompt: prefix)
              const phone = result.input.replace(/^(tel|telprompt):/, '').trim();
              // Update test input first
              updateTestInput({ phone });
              // Launch using launchPhone which handles history correctly
              await launchPhone();
            } else {
              // If not a tel: URI, try as regular URL
              await launchUrl(result.input);
            }
            break;
          case 'openSMS':
            // Parse sms: URI
            if (result.input.startsWith('sms:')) {
              const smsMatch = result.input.match(/^sms:(.*?)(\?|$)/);
              // Recipients can be comma-separated, keep as is for launchSMS
              const recipients = smsMatch ? decodeURIComponent(smsMatch[1]) : '';
              const params = new URLSearchParams(result.input.split('?')[1] || '');
              const body = params.get('body') || '';
              updateTestInput({ smsRecipients: recipients, smsBody: body });
              await launchSMS();
            } else {
              // If not a sms: URI, try as regular URL
              await launchUrl(result.input);
            }
            break;
          case 'openMap':
            // Parse geo: URI
            if (result.input.startsWith('geo:')) {
              // Check if it's address-based (geo:0,0?q=address)
              if (result.input.includes('?q=')) {
                const addressMatch = result.input.match(/\?q=(.+)$/);
                if (addressMatch) {
                  const address = decodeURIComponent(addressMatch[1]);
                  updateTestInput({ mapAddress: address, mapLatitude: undefined, mapLongitude: undefined, mapLabel: undefined });
                  await launchMap();
                } else {
                  // Invalid geo URI, try as regular URL
                  await launchUrl(result.input);
                }
              } else {
                // Coordinate-based: geo:lat,lng or geo:lat,lng(label)
                const geoMatch = result.input.match(/^geo:([^?]+)/);
                if (geoMatch) {
                  const coords = geoMatch[1];
                  const coordMatch = coords.match(/^([+-]?[\d.]+),([+-]?[\d.]+)(?:\((.+)\))?/);
                  if (coordMatch) {
                    const lat = parseFloat(coordMatch[1]);
                    const lng = parseFloat(coordMatch[2]);
                    const label = coordMatch[3] ? decodeURIComponent(coordMatch[3]) : '';
                    updateTestInput({ mapLatitude: lat, mapLongitude: lng, mapLabel: label, mapAddress: undefined });
                    await launchMap();
                  } else {
                    // Invalid geo URI, try as regular URL
                    await launchUrl(result.input);
                  }
                } else {
                  // Invalid geo URI, try as regular URL
                  await launchUrl(result.input);
                }
              }
            } else {
              // If not a geo: URI, try as regular URL
              await launchUrl(result.input);
            }
            break;
          case 'openInBrowser':
            // For in-browser, just use the URL directly
            if (result.input) {
              updateTestInput({ url: result.input });
              await launchInBrowser();
            }
            break;
          case 'openAppStore':
            // Parse app store URI
            if (result.input.startsWith('itms-apps://') || result.input.startsWith('market://')) {
              // Extract app ID from URI
              // iOS: itms-apps://apps.apple.com/app/id123456789
              // Android: market://details?id=com.example.app
              let appId = '';
              if (result.input.includes('itms-apps://')) {
                const iosMatch = result.input.match(/\/id(\d+)/);
                if (iosMatch) {
                  appId = iosMatch[1];
                }
              } else if (result.input.includes('market://')) {
                const androidMatch = result.input.match(/[?&]id=([^&]+)/);
                if (androidMatch) {
                  appId = androidMatch[1];
                }
              }
              if (appId) {
                const hasReview = result.input.includes('write-review') || result.input.includes('review') || result.input.includes('action=write-review');
                updateTestInput({ appStoreId: appId, appStoreReview: hasReview });
                await launchAppStore();
              } else {
                // Could not extract app ID, try as regular URL
                await launchUrl(result.input);
              }
            } else {
              // Assume it's an app ID (not a URI)
              updateTestInput({ appStoreId: result.input, appStoreReview: false });
              await launchAppStore();
            }
            break;
          case 'openSettings':
            // Parse settings URI
            if (result.input.startsWith('app-settings:') || result.input.startsWith('android.settings.')) {
              // Extract section from URI
              let section: 'general' | 'app' | 'privacy' | 'wifi' | 'bluetooth' | 'cellular' | undefined = 'general';
              if (result.input.includes('APPLICATION_DETAILS')) {
                section = 'app';
              } else if (result.input.includes('PRIVACY')) {
                section = 'privacy';
              } else if (result.input.includes('WIFI')) {
                section = 'wifi';
              } else if (result.input.includes('BLUETOOTH')) {
                section = 'bluetooth';
              } else if (result.input.includes('CELLULAR')) {
                section = 'cellular';
              }
              updateTestInput({ settingsSection: section });
              await launchSettings();
            } else {
              // Assume it's a section name (not a URI)
              const validSections = ['general', 'app', 'privacy', 'wifi', 'bluetooth', 'cellular'];
              const section = validSections.includes(result.input.toLowerCase()) 
                ? (result.input.toLowerCase() as 'general' | 'app' | 'privacy' | 'wifi' | 'bluetooth' | 'cellular')
                : 'general';
              updateTestInput({ settingsSection: section });
              await launchSettings();
            }
            break;
          case 'openDeepLink':
            // Parse deep link URI
            if (result.input.includes(' (fallback: ')) {
              // Extract deep link and fallback
              const parts = result.input.split(' (fallback: ');
              const deepLink = parts[0];
              const fallback = parts[1]?.replace(/\)$/, '').trim();
              updateTestInput({ deepLinkUrl: deepLink, fallbackUrl: fallback });
            } else {
              updateTestInput({ deepLinkUrl: result.input, fallbackUrl: undefined });
            }
            await launchDeepLink();
            break;
          default:
            // For unknown function names or if input is a URI, try to open as URL
            // But first check if it's a special URI that should use a specific function
            if (result.input.startsWith('mailto:')) {
              // Try to parse as email
              const mailtoMatch = result.input.match(/^mailto:(.*?)(\?|$)/);
              const email = mailtoMatch ? decodeURIComponent(mailtoMatch[1]) : '';
              const params = new URLSearchParams(result.input.split('?')[1] || '');
              const subject = params.get('subject') || '';
              const body = params.get('body') || '';
              const cc = params.get('cc') || '';
              const bcc = params.get('bcc') || '';
              updateTestInput({ email, emailSubject: subject, emailBody: body, emailCc: cc, emailBcc: bcc });
              await launchEmail();
            } else if (result.input.startsWith('tel:') || result.input.startsWith('telprompt:')) {
              // Try to parse as phone
              const phone = result.input.replace(/^(tel|telprompt):/, '').trim();
              updateTestInput({ phone });
              await launchPhone();
            } else if (result.input.startsWith('sms:')) {
              // Try to parse as SMS
              const smsMatch = result.input.match(/^sms:(.*?)(\?|$)/);
              const recipients = smsMatch ? decodeURIComponent(smsMatch[1]) : '';
              const params = new URLSearchParams(result.input.split('?')[1] || '');
              const body = params.get('body') || '';
              updateTestInput({ smsRecipients: recipients, smsBody: body });
              await launchSMS();
            } else if (result.input.startsWith('geo:')) {
              // Try to parse as map
              // Check if it's address-based (geo:0,0?q=address)
              if (result.input.includes('?q=')) {
                const addressMatch = result.input.match(/\?q=(.+)$/);
                if (addressMatch) {
                  const address = decodeURIComponent(addressMatch[1]);
                  updateTestInput({ mapAddress: address, mapLatitude: undefined, mapLongitude: undefined, mapLabel: undefined });
                  await launchMap();
                } else {
                  await launchUrl(result.input);
                }
              } else {
                // Coordinate-based: geo:lat,lng or geo:lat,lng(label)
                const geoMatch = result.input.match(/^geo:([^?]+)/);
                if (geoMatch) {
                  const coords = geoMatch[1];
                  const coordMatch = coords.match(/^([+-]?[\d.]+),([+-]?[\d.]+)(?:\((.+)\))?/);
                  if (coordMatch) {
                    const lat = parseFloat(coordMatch[1]);
                    const lng = parseFloat(coordMatch[2]);
                    const label = coordMatch[3] ? decodeURIComponent(coordMatch[3]) : '';
                    updateTestInput({ mapLatitude: lat, mapLongitude: lng, mapLabel: label, mapAddress: undefined });
                    await launchMap();
                  } else {
                    await launchUrl(result.input);
                  }
                } else {
                  await launchUrl(result.input);
                }
              }
            } else {
              // Default: try to open as regular URL
              await launchUrl(result.input);
            }
        }
      }
    } catch (error) {
      console.error('Error re-launching:', error);
    } finally {
      setIsLoading(false);
    }
  }, [launchUrl, launchEmail, launchPhone, launchSMS, launchMap, launchInBrowser, launchAppStore, launchSettings, launchDeepLink, updateTestInput, setIsLoading]);

  return {
    testInput,
    testResults,
    isLoading,
    history,
    runAllTests,
    updateTestInput,
    launchUrl,
    launchEmail,
    launchPhone,
    launchSMS,
    launchMap,
    launchInBrowser,
    launchAppStore,
    launchSettings,
    launchDeepLink,
    buildUrlWithParams,
    reLaunchFromHistory,
    clearResults,
    addQueryParameter,
    updateQueryParameter,
    removeQueryParameter,
  };
}

