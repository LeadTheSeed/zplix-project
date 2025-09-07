<?php
/**
 * Salati Account Credit System
 * 
 * This module allows customers to deposit funds into their account
 * and use the credit for future purchases.
 * 
 * Supports multiple currencies and automatic conversion rates.
 */
class ModelExtensionSalatiAccountCredit extends Model {
    
    /**
     * Get the current account credit for a customer
     *
     * @param int $customerId Customer ID
     * @return float Credit amount
     */
    public function getCredit($customerId) {
        $query = $this->db->query("SELECT credit FROM " . DB_PREFIX . "customer_credit WHERE customer_id = '" . (int)$customerId . "'");
        
        if ($query->num_rows) {
            return $query->row['credit'];
        }
        
        return 0;
    }
    
    /**
     * Add credit to customer account
     *
     * @param int $customerId Customer ID
     * @param float $amount Amount to add
     * @param string $currency Currency code
     * @param string $description Transaction description
     * @return bool Success
     */
    public function addCredit($customerId, $amount, $currency, $description = '') {
        // Convert to default currency if needed
        if ($currency != $this->config->get('config_currency')) {
            $this->load->model('localisation/currency');
            $amount = $this->currency->convert($amount, $currency, $this->config->get('config_currency'));
        }
        
        // Check if customer already has credit entry
        $query = $this->db->query("SELECT * FROM " . DB_PREFIX . "customer_credit WHERE customer_id = '" . (int)$customerId . "'");
        
        if ($query->num_rows) {
            // Update existing credit
            $this->db->query("UPDATE " . DB_PREFIX . "customer_credit SET 
                credit = credit + '" . (float)$amount . "' 
                WHERE customer_id = '" . (int)$customerId . "'");
        } else {
            // Create new credit entry
            $this->db->query("INSERT INTO " . DB_PREFIX . "customer_credit SET 
                customer_id = '" . (int)$customerId . "', 
                credit = '" . (float)$amount . "'");
        }
        
        // Add transaction history
        $this->db->query("INSERT INTO " . DB_PREFIX . "customer_credit_transaction SET 
            customer_id = '" . (int)$customerId . "', 
            amount = '" . (float)$amount . "', 
            description = '" . $this->db->escape($description) . "', 
            date_added = NOW()");
        
        return true;
    }
    
    /**
     * Deduct credit from customer account
     *
     * @param int $customerId Customer ID
     * @param float $amount Amount to deduct
     * @param string $description Transaction description
     * @return bool Success
     */
    public function deductCredit($customerId, $amount, $description = '') {
        // Check if customer has sufficient credit
        $query = $this->db->query("SELECT credit FROM " . DB_PREFIX . "customer_credit WHERE customer_id = '" . (int)$customerId . "'");
        
        if ($query->num_rows && $query->row['credit'] >= $amount) {
            // Deduct credit
            $this->db->query("UPDATE " . DB_PREFIX . "customer_credit SET 
                credit = credit - '" . (float)$amount . "' 
                WHERE customer_id = '" . (int)$customerId . "'");
            
            // Add transaction history (negative amount)
            $this->db->query("INSERT INTO " . DB_PREFIX . "customer_credit_transaction SET 
                customer_id = '" . (int)$customerId . "', 
                amount = '" . (float)(-$amount) . "', 
                description = '" . $this->db->escape($description) . "', 
                date_added = NOW()");
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Get transaction history for a customer
     *
     * @param int $customerId Customer ID
     * @param int $start Start record
     * @param int $limit Number of records
     * @return array Transaction history
     */
    public function getTransactions($customerId, $start = 0, $limit = 10) {
        $query = $this->db->query("SELECT * FROM " . DB_PREFIX . "customer_credit_transaction 
            WHERE customer_id = '" . (int)$customerId . "' 
            ORDER BY date_added DESC 
            LIMIT " . (int)$start . "," . (int)$limit);
            
        return $query->rows;
    }
    
    /**
     * Install the required database tables for the credit system
     */
    public function install() {
        $this->db->query("
            CREATE TABLE IF NOT EXISTS `" . DB_PREFIX . "customer_credit` (
                `customer_id` INT(11) NOT NULL,
                `credit` DECIMAL(15,4) NOT NULL DEFAULT '0.0000',
                PRIMARY KEY (`customer_id`)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
        ");
        
        $this->db->query("
            CREATE TABLE IF NOT EXISTS `" . DB_PREFIX . "customer_credit_transaction` (
                `transaction_id` INT(11) NOT NULL AUTO_INCREMENT,
                `customer_id` INT(11) NOT NULL,
                `amount` DECIMAL(15,4) NOT NULL,
                `description` TEXT NOT NULL,
                `date_added` DATETIME NOT NULL,
                PRIMARY KEY (`transaction_id`)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
        ");
    }
    
    /**
     * Uninstall the credit system tables
     */
    public function uninstall() {
        $this->db->query("DROP TABLE IF EXISTS `" . DB_PREFIX . "customer_credit`");
        $this->db->query("DROP TABLE IF EXISTS `" . DB_PREFIX . "customer_credit_transaction`");
    }
}
