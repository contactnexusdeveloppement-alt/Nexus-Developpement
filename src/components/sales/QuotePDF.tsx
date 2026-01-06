import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1f2937',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#3b82f6',
    },
    logo: {
        width: 120,
        height: 40,
        objectFit: 'contain',
    },
    quoteInfo: {
        textAlign: 'right',
    },
    quoteNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3b82f6',
        marginBottom: 5,
    },
    quoteDate: {
        fontSize: 9,
        color: '#6b7280',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1f2937',
        textTransform: 'uppercase',
    },
    clientInfo: {
        backgroundColor: '#f9fafb',
        padding: 15,
        borderRadius: 4,
    },
    clientRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        width: 100,
        color: '#4b5563',
    },
    value: {
        flex: 1,
        color: '#1f2937',
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#3b82f6',
        padding: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        padding: 10,
    },
    tableRowAlt: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        padding: 10,
        backgroundColor: '#f9fafb',
    },
    col1: {
        flex: 3,
    },
    col2: {
        flex: 2,
        textAlign: 'right',
    },
    col3: {
        flex: 1,
        textAlign: 'right',
    },
    totalSection: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        width: 250,
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    totalRowFinal: {
        flexDirection: 'row',
        width: 250,
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 5,
    },
    notes: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#eff6ff',
        borderLeftWidth: 3,
        borderLeftColor: '#3b82f6',
    },
    notesTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1e40af',
    },
    notesText: {
        fontSize: 9,
        lineHeight: 1.4,
        color: '#1f2937',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 15,
    },
    footerText: {
        fontSize: 9,
        color: '#6b7280',
        marginBottom: 3,
    },
    footerSales: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    validityText: {
        marginTop: 20,
        fontSize: 9,
        color: '#6b7280',
        fontStyle: 'italic',
    },
});

interface QuotePDFProps {
    quoteNumber: string;
    quoteDate: string;
    validUntil: string;
    client: {
        name: string;
        company?: string;
        email: string;
    };
    pack: {
        name: string;
        price: number;
        description: string;
    };
    options: Array<{
        name: string;
        price: number;
        description: string;
    }>;
    packAmount: number;
    optionsAmount: number;
    totalHT: number;
    tva: number;
    totalTTC: number;
    salesPartnerName: string;
    clientNotes?: string;
}

export const QuotePDF = ({
    quoteNumber,
    quoteDate,
    validUntil,
    client,
    pack,
    options,
    packAmount,
    optionsAmount,
    totalHT,
    tva,
    totalTTC,
    salesPartnerName,
    clientNotes,
}: QuotePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3b82f6' }}>
                        NEXUS DÉVELOPPEMENT
                    </Text>
                    <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 3 }}>
                        Solutions Web Sur-Mesure
                    </Text>
                </View>
                <View style={styles.quoteInfo}>
                    <Text style={styles.quoteNumber}>Devis N° {quoteNumber}</Text>
                    <Text style={styles.quoteDate}>Date : {quoteDate}</Text>
                    <Text style={styles.quoteDate}>Valable jusqu'au : {validUntil}</Text>
                </View>
            </View>

            {/* Informations Client */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informations Client</Text>
                <View style={styles.clientInfo}>
                    <View style={styles.clientRow}>
                        <Text style={styles.label}>Nom :</Text>
                        <Text style={styles.value}>{client.name}</Text>
                    </View>
                    {client.company && (
                        <View style={styles.clientRow}>
                            <Text style={styles.label}>Entreprise :</Text>
                            <Text style={styles.value}>{client.company}</Text>
                        </View>
                    )}
                    <View style={styles.clientRow}>
                        <Text style={styles.label}>Email :</Text>
                        <Text style={styles.value}>{client.email}</Text>
                    </View>
                </View>
            </View>

            {/* Tableau des Prestations */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Détail des Prestations</Text>

                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.col1}>Description</Text>
                        <Text style={styles.col2}>Détails</Text>
                        <Text style={styles.col3}>Montant</Text>
                    </View>

                    {/* Pack Principal */}
                    <View style={styles.tableRow}>
                        <Text style={styles.col1}>📦 {pack.name}</Text>
                        <Text style={styles.col2}>{pack.description}</Text>
                        <Text style={styles.col3}>{packAmount.toFixed(2)} €</Text>
                    </View>

                    {/* Options */}
                    {options.map((option, index) => (
                        <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                            <Text style={styles.col1}>+ {option.name}</Text>
                            <Text style={styles.col2}>{option.description}</Text>
                            <Text style={styles.col3}>{option.price.toFixed(2)} €</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Totaux */}
            <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                    <Text>Total HT :</Text>
                    <Text>{totalHT.toFixed(2)} €</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text>TVA (20%) :</Text>
                    <Text>{tva.toFixed(2)} €</Text>
                </View>
                <View style={styles.totalRowFinal}>
                    <Text>TOTAL TTC :</Text>
                    <Text>{totalTTC.toFixed(2)} €</Text>
                </View>
            </View>

            {/* Notes Client */}
            {clientNotes && (
                <View style={styles.notes}>
                    <Text style={styles.notesTitle}>Informations Complémentaires</Text>
                    <Text style={styles.notesText}>{clientNotes}</Text>
                </View>
            )}

            {/* Validité */}
            <Text style={styles.validityText}>
                Ce devis est valable jusqu'au {validUntil}. Au-delà de cette date, les prix et disponibilités peuvent être révisés.
            </Text>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerSales}>
                    Dossier suivi par {salesPartnerName}
                </Text>
                <Text style={styles.footerText}>Nexus Développement</Text>
                <Text style={styles.footerText}>contact@nexus-dev.com • www.nexus-dev.com</Text>
            </View>
        </Page>
    </Document>
);
