<?php
/**
 * Salati Auto Currency Detection Module
 * 
 * This module automatically detects the user's location based on their IP address
 * and changes the store currency accordingly.
 * 
 * Supported countries and currencies:
 * - United Arab Emirates (AED)
 * - Jordan (JOD)
 * - Saudi Arabia (SAR)
 * - Kuwait (KWD)
 * - Qatar (QAR)
 * - Bahrain (BHD)
 * - Oman (OMR)
 * - Egypt (EGP)
 * - Lebanon (LBP)
 * - Default: USD
 */
class ModelExtensionSalatiAutodetectCurrency extends Model {
    
    // Country code to currency code mapping
    private $countryToCurrency = [
        'AE' => 'AED', // United Arab Emirates
        'JO' => 'JOD', // Jordan
        'SA' => 'SAR', // Saudi Arabia
        'KW' => 'KWD', // Kuwait
        'QA' => 'QAR', // Qatar
        'BH' => 'BHD', // Bahrain
        'OM' => 'OMR', // Oman
        'EG' => 'EGP', // Egypt
        'LB' => 'LBP'  // Lebanon
    ];
    
    /**
     * Detect user's location and set appropriate currency
     */
    public function autoDetect() {
        // Get the visitor's IP address
        $ip = $_SERVER['REMOTE_ADDR'];
        
        // Skip for localhost/development
        if ($ip == '127.0.0.1' || $ip == '::1') {
            return;
        }
        
        // API endpoint for geolocation
        $endpoint = 'http://ip-api.com/json/' . $ip;
        
        try {
            $response = file_get_contents($endpoint);
            $data = json_decode($response, true);
            
            if ($data && isset($data['countryCode'])) {
                $countryCode = $data['countryCode'];
                
                // If we support this country's currency
                if (isset($this->countryToCurrency[$countryCode])) {
                    $currencyCode = $this->countryToCurrency[$countryCode];
                    
                    // Check if the currency exists in our store
                    $this->load->model('localisation/currency');
                    $currencies = $this->model_localisation_currency->getCurrencies();
                    
                    foreach ($currencies as $currency) {
                        if ($currency['code'] == $currencyCode && $currency['status']) {
                            // Set the currency
                            $this->session->data['currency'] = $currencyCode;
                            break;
                        }
                    }
                }
            }
        } catch (Exception $e) {
            // Log the error but don't stop the application
            $this->log->write('Error in currency auto-detection: ' . $e->getMessage());
        }
    }
}
