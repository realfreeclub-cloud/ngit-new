
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

interface Element {
    id: string;
    type: string;
    content: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    opacity?: number;
    style?: {
        fontSize?: number;
        color?: string;
        fontWeight?: string;
        textAlign?: any;
        fontFamily?: string;
        letterSpacing?: number;
        lineHeight?: number;
        borderRadius?: number;
        objectFit?: any;
    };
    // Backward compatibility
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    textAlign?: any;
    fontFamily?: string;
}

interface DynamicCertificateProps {
    backgroundImage?: string;
    elements: Element[];
    placeholders: { [key: string]: string };
    config?: {
        format: string;
        orientation: "portrait" | "landscape";
        dpi: number;
    };
}

const styles = StyleSheet.create({
    page: {
        position: 'relative',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
});

export const DynamicCertificateTemplate = ({ elements, placeholders, backgroundImage, config }: DynamicCertificateProps) => {

    // Replace placeholders in text
    const processContent = (content: string) => {
        let text = content;
        // Replace known placeholders
        Object.keys(placeholders).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            text = text.replace(regex, placeholders[key] || '');
        });
        
        // Remove any remaining unresolved placeholders (e.g. {{student_photo}} if not provided)
        // This prevents the PDF/Browser from trying to fetch "{{key}}" as a URL
        text = text.replace(/{{[^{}]*}}/g, '');
        
        return text;
    };

    // Default to A4 Landscape if config missing
    const pageSize = (config?.format || 'A4') as any;
    const pageOrientation = (config?.orientation || 'landscape') as any;

    return (
        <Document>
            <Page size={pageSize} orientation={pageOrientation} style={styles.page}>
                {backgroundImage && (
                    <Image src={backgroundImage} style={styles.background} />
                )}

                {elements.map((el) => {
                    const style = el.style || {};
                    const rotation = el.rotation ? `rotate(${el.rotation}deg)` : undefined;

                    // Merge flat props for backward compatibility
                    const fontSize = style.fontSize || el.fontSize || 12;
                    const color = style.color || el.color || '#000000';
                    const fontWeight = (style.fontWeight || el.fontWeight || 'normal') as any;
                    const fontFamily = style.fontFamily || el.fontFamily || 'Helvetica';
                    const textAlign = (style.textAlign || el.textAlign || 'left') as any;

                    const commonStyles: any = {
                        position: 'absolute',
                        left: el.x,
                        top: el.y,
                        width: el.width,
                        height: el.height,
                        opacity: el.opacity !== undefined ? el.opacity : 1,
                        transform: rotation
                    };

                    if (el.type === 'text') {
                        return (
                            <Text
                                key={el.id}
                                style={{
                                    ...commonStyles,
                                    fontSize,
                                    color,
                                    fontWeight,
                                    fontFamily,
                                    textAlign,
                                    letterSpacing: style.letterSpacing,
                                    lineHeight: style.lineHeight,
                                }}
                            >
                                {processContent(el.content)}
                            </Text>
                        );
                    } else if (el.type === 'image' || el.type === 'qrcode') {
                        // For QR code, content should be the data URL generated externally and passed as placeholder or base64
                        const src = el.type === 'qrcode' ? placeholders['qr_code'] : (el.content.startsWith('{{') ? processContent(el.content) : el.content);

                        if (!src) return null;

                        return (
                            <Image
                                key={el.id}
                                src={typeof src === 'string' && src.startsWith('data:') ? { uri: src } : src}
                                style={{
                                    ...commonStyles,
                                    objectFit: style.objectFit || 'contain',
                                    borderRadius: style.borderRadius
                                }}
                            />
                        );
                    }
                    return null;
                })}
            </Page>
        </Document>
    );
};
