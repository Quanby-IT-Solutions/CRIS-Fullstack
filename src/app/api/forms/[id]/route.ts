// src/app/api/forms/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Extract id from params
        const formId = params.id

        // Destructure documentId from the request body
        const { documentId } = await request.json()

        // Validate required fields
        if (!documentId) {
            return NextResponse.json(
                { error: 'Missing documentId field' },
                { status: 400 }
            )
        }

        // Validate the form exists
        const existingForm = await prisma.baseRegistryForm.findUnique({
            where: { id: formId },
        })

        if (!existingForm) {
            return NextResponse.json(
                { error: 'Form not found' },
                { status: 404 }
            )
        }

        // Update the BaseRegistryForm's documentId field
        const updatedForm = await prisma.baseRegistryForm.update({
            where: { id: formId },
            data: { documentId },
        })

        return NextResponse.json(
            { success: true, data: updatedForm },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error updating BaseRegistryForm:', error)
        return NextResponse.json(
            {
                error: 'Failed to update BaseRegistryForm',
                details:
                    error && typeof error === 'object' && 'message' in error
                        ? (error as Error).message
                        : 'Unknown error',
            },
            { status: 500 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const formId = params.id

        const form = await prisma.baseRegistryForm.findUnique({
            where: { id: formId },
            include: {
                birthCertificateForm: true,
                deathCertificateForm: true,
                marriageCertificateForm: true,
                preparedBy: true,
                verifiedBy: true,
            },
        })

        if (!form) {
            return NextResponse.json(
                { error: 'Form not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: true, data: form },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching BaseRegistryForm:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch BaseRegistryForm',
                details:
                    error && typeof error === 'object' && 'message' in error
                        ? (error as Error).message
                        : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
