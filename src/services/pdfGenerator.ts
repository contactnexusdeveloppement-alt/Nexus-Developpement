import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

interface QuoteData {
    id: string;
    quote_number?: string;
    amount: number;
    status: string;
    created_at: string;
    content: {
        category?: { id: string; label: string };
        selected_pack?: {
            name: string;
            price: number;
            description: string;
            features: string[];
        };
        selected_options?: Array<{
            id: string;
            name: string;
            price: number;
            description: string;
        }>;
        base_amount?: number;
        final_amount?: number;
        is_custom_price?: boolean;
        client_notes?: string;
        valid_until?: string;
    };
    prospect?: {
        name: string;
        email?: string;
        business_type?: string;
        address?: string;
        city?: string;
        postal_code?: string;
        phone?: string;
    };
    sales_partner?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
    };
}

// Helper to load logo
const loadLogo = async (): Promise<string | null> => {
    try {
        const response = await fetch('/email-logo.png'); // Use PNG for better transparency support
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error('Failed to load logo', e);
        return null;
    }
};

export const generateQuotePDF = async (quote: QuoteData): Promise<Blob> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15; // 15mm margin as per CSS
    let yPos = margin;

    // Brand Colors
    const primaryColor: [number, number, number] = [109, 127, 240]; // #6d7ff0
    const lightGrey: [number, number, number] = [245, 246, 250]; // #f5f6fa
    const textDark: [number, number, number] = [34, 34, 34]; // #222
    const textGrey: [number, number, number] = [85, 85, 85]; // #555

    // Helper functions
    const setFont = (type: 'normal' | 'bold' | 'bolditalic' | 'italic' = 'normal', size: number = 10, color: [number, number, number] = textDark) => {
        doc.setFont('helvetica', type);
        doc.setFontSize(size);
        doc.setTextColor(...color);
    };

    // Load logo
    const logoData = await loadLogo();

    // ==================== HEADER ====================
    // Border bottom
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.8); // 3px approx
    doc.line(margin, yPos + 35, pageWidth - margin, yPos + 35); // Lowered line to fit logo

    // Left: Logo
    if (logoData) {
        // Assume logo is squareish or wide. Let's constrain height to 25mm max
        try {
            // Force PNG format usage - Increased back to 22 for better presence
            doc.addImage(logoData, 'PNG', margin, yPos, 22, 22);
        } catch (e) {
            // Fallback if PNG add fails
            doc.setFontSize(22);
            doc.setTextColor(...primaryColor);
            doc.setFont('helvetica', 'bold');
            doc.text('NEXUS', margin, yPos + 10);
        }
    } else {
        // Fallback text logo
        doc.setFontSize(22);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('NEXUS', margin, yPos + 10);
        doc.setFontSize(9);
        doc.text('DÉVELOPPEMENT', margin, yPos + 15);
    }

    // Center: DEVIS Title - Increased size
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVIS', pageWidth / 2, yPos + 14, { align: 'center' });

    // Right: Quote Number - Larger
    doc.setFontSize(14);
    doc.setTextColor(...textGrey);
    doc.setFont('helvetica', 'bold');

    // Display the quote number from database
    const quoteRef = quote.quote_number || quote.id.slice(0, 8).toUpperCase();
    doc.text(`N° ${quoteRef}`, pageWidth - margin, yPos + 14, { align: 'right' });

    yPos += 45; // Adjusted for logo height + spacing

    // ==================== INFO GRID ====================
    const colWidth = (pageWidth - 2 * margin - 10) / 2;

    // Company Block (Left) - Simplified
    let leftY = yPos;
    setFont('bold', 10, textDark);
    doc.text('Nexus Développement', margin, leftY);
    leftY += 5;
    setFont('normal', 9, textDark);
    doc.text('4 rue de la ferme', margin, leftY); leftY += 4;
    doc.text('78990 Élancourt', margin, leftY); leftY += 4;
    doc.text('SIRET : 995 394 095 00013', margin, leftY); leftY += 4;
    doc.text('contact.nexus.developpement@gmail.com', margin, leftY); leftY += 4;
    doc.text('07 61 84 75 80', margin, leftY);

    // Client Block (Right)
    const clientX = margin + colWidth + 10;
    // Grey background for client
    doc.setFillColor(...lightGrey);
    doc.rect(clientX - 3, yPos - 3, colWidth + 6, 35, 'F');
    doc.setDrawColor(224, 226, 240); // #e0e2f0
    doc.rect(clientX - 3, yPos - 3, colWidth + 6, 35, 'S');

    let rightY = yPos + 2;
    setFont('bold', 10, textDark);
    doc.text(quote.prospect?.name || 'Client', clientX, rightY);
    rightY += 5;

    setFont('normal', 9, textDark);
    if (quote.prospect?.address) { doc.text(quote.prospect.address, clientX, rightY); rightY += 4; }
    if (quote.prospect?.postal_code || quote.prospect?.city) {
        doc.text(`${quote.prospect.postal_code || ''} ${quote.prospect.city || ''}`.trim(), clientX, rightY);
        rightY += 4;
    }
    if (quote.prospect?.email) { doc.text(quote.prospect.email, clientX, rightY); rightY += 4; }
    if (quote.prospect?.phone) { doc.text(quote.prospect.phone, clientX, rightY); }

    yPos = Math.max(leftY, rightY) + 15;

    // ==================== DATES ====================
    // Blue left border block
    doc.setFillColor(250, 251, 255); // #fafbff
    doc.rect(margin, yPos, pageWidth - 2 * margin, 12, 'F');
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, 1.5, 12, 'F'); // 4px border left

    setFont('normal', 9, textDark);
    const dateY = yPos + 7;

    // Dates formatting
    const dateEmission = new Date(quote.created_at).toLocaleDateString('fr-FR');
    const validUntil = quote.content?.valid_until
        ? new Date(quote.content.valid_until).toLocaleDateString('fr-FR')
        : new Date(new Date(quote.created_at).setDate(new Date(quote.created_at).getDate() + 30)).toLocaleDateString('fr-FR');

    doc.text(`Date d'émission : ${dateEmission}`, margin + 5, dateY);
    doc.text(`Date de validité : ${validUntil}`, pageWidth - margin - 5, dateY, { align: 'right' });

    yPos += 20;

    // ==================== ITEMS TABLE ====================
    // Header
    const col1 = margin + 2; // Description
    const col2 = pageWidth - margin - 50; // Qty (approx)
    const col3 = pageWidth - margin - 25; // Price
    const col4 = pageWidth - margin - 2; // Total

    // Header Background
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');

    // Header Text
    setFont('bold', 9, [255, 255, 255]);
    doc.text('Description', col1, yPos + 5.5);
    doc.text('Qté', col2, yPos + 5.5, { align: 'right' });
    doc.text('PU HT', col3, yPos + 5.5, { align: 'right' });
    doc.text('Total HT', col4, yPos + 5.5, { align: 'right' });

    yPos += 8;

    // Rows
    const pack = quote.content?.selected_pack;
    const options = quote.content?.selected_options || [];
    let rowCount = 0;

    const drawRow = (desc: string, qty: number, price: number, total: number) => {
        // Stripe background
        if (rowCount % 2 !== 0) {
            doc.setFillColor(250, 251, 255); // #fafbff
            doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        }

        setFont('normal', 9, textDark);
        doc.text(desc, col1, yPos + 5.5);
        doc.text(qty.toString(), col2, yPos + 5.5, { align: 'right' });
        doc.text(`${price} €`, col3, yPos + 5.5, { align: 'right' });
        doc.text(`${total} €`, col4, yPos + 5.5, { align: 'right' });

        // Bottom border
        doc.setDrawColor(232, 233, 240);
        doc.line(margin, yPos + 8, pageWidth - margin, yPos + 8);

        yPos += 8;
        rowCount++;
    };

    if (pack) {
        drawRow(pack.name, 1, pack.price, pack.price);
        // Pack description (small text below)
        if (pack.description) {
            setFont('italic', 8, textGrey);
            const splitDesc = doc.splitTextToSize(pack.description, 100);
            doc.text(splitDesc, col1 + 5, yPos + 3);
            yPos += (splitDesc.length * 3) + 2;
        }
    }

    options.forEach(opt => {
        drawRow(opt.name, 1, opt.price, opt.price);
    });

    yPos += 10;

    // ==================== TOTALS ====================
    // Right aligned table
    const totalTableWidth = 70;
    const totalTableX = pageWidth - margin - totalTableWidth;

    const drawTotalRow = (label: string, value: string, isFinal: boolean = false) => {
        if (isFinal) {
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.5);
            doc.line(totalTableX, yPos, pageWidth - margin, yPos);
            yPos += 5;
            setFont('bold', 11, primaryColor);
        } else {
            setFont('normal', 9, textDark);
        }

        doc.text(label, totalTableX + 2, yPos + 4);
        doc.text(value, pageWidth - margin - 2, yPos + 4, { align: 'right' });

        yPos += isFinal ? 8 : 6;
    };

    const totalHT = quote.amount || 0;
    const tva = totalHT * 0.20; // Assuming 20% TVA
    const totalTTC = totalHT + tva;

    drawTotalRow('Sous-total HT', `${totalHT.toFixed(2)} €`);
    drawTotalRow('TVA (20%)', `${tva.toFixed(2)} €`);
    drawTotalRow('Total TTC', `${totalTTC.toFixed(2)} €`, true);

    // ==================== FOOTER ====================
    // Reset Y to bottom - expanded footer
    const footerHeight = 70;
    yPos = pageHeight - footerHeight - margin;

    doc.setDrawColor(232, 233, 240);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;

    // 2-Column Footer Layout
    const leftColX = margin;
    const rightColX = pageWidth / 2 + 10;

    // --- LEFT COLUMN: Signature ---
    let footerLeftY = yPos;
    setFont('bold', 9, textDark);
    doc.text('Signature du client', leftColX, footerLeftY + 4);

    // Signature box
    doc.setDrawColor(...primaryColor);
    doc.setLineDashPattern([1, 1], 0);
    doc.rect(leftColX, footerLeftY + 8, 80, 25);
    doc.setLineDashPattern([], 0);

    setFont('normal', 8, [170, 170, 170]);
    doc.text('Signature et cachet', leftColX + 40, footerLeftY + 20, { align: 'center' });

    // Date below signature box
    setFont('normal', 8, [102, 102, 102]);
    doc.text('Date : _______________', leftColX, footerLeftY + 40);


    // --- RIGHT COLUMN: Conditions & Notes ---
    let footerRightY = yPos;

    // Conditions de paiement (Aligned with Signature Header)
    setFont('bold', 9, textDark);
    doc.text('Conditions de paiement', rightColX, footerRightY + 4);

    setFont('normal', 8, textGrey);
    const conditionsText = doc.splitTextToSize('Acompte de 30% à la signature, solde à la livraison.', (pageWidth / 2) - margin - 10);
    doc.text(conditionsText, rightColX, footerRightY + 10);

    footerRightY += 20;

    // Notes (Aligned with Date approximately)
    setFont('bold', 9, textDark);
    doc.text('Pénalités de retard', rightColX, footerRightY + 4);

    setFont('normal', 7, textGrey);
    const notesText = doc.splitTextToSize("En cas de retard de paiement : taux d'intérêt légal en vigueur + indemnité forfaitaire de 40€.", (pageWidth / 2) - margin - 10);
    doc.text(notesText, rightColX, footerRightY + 10);


    // --- Legal Bottom ---
    const legalY = pageHeight - margin - 5;
    doc.setDrawColor(232, 233, 240);
    doc.line(margin, legalY - 5, pageWidth - margin, legalY - 5);

    setFont('normal', 6, [119, 119, 119]);
    doc.text(`Nexus Développement - SARL au capital de 500€ - RCS 995 394 095 R.C.S. Versailles – TVA FR49995394095`, pageWidth / 2, legalY - 3, { align: 'center' });
    doc.text(`Devis valable jusqu'au ${validUntil} – En cas d'acceptation, merci de retourner ce devis signé avec la mention « Bon pour accord ».`, pageWidth / 2, legalY + 2, { align: 'center' });

    return doc.output('blob');
};

export const downloadQuotePDF = async (quote: QuoteData) => {
    try {
        const pdfBlob = await generateQuotePDF(quote);
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        // Use the quote_number for the filename
        const quoteRef = quote.quote_number || quote.id.slice(0, 8).toUpperCase();
        link.href = url;
        link.download = `Devis_${quoteRef}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};

export const openQuotePDF = async (quote: QuoteData) => {
    const pdfBlob = await generateQuotePDF(quote);
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
};
