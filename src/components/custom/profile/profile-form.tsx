'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileWithUser } from '@/types/user-profile'
import { OCCUPATIONS } from '@/lib/constants/occupations'
import { Province, City, Barangay } from '@/lib/constants/locations'
import { ProfileFormValues, profileFormSchema } from '@/lib/validation/profile/profile-form'
import { PROVINCES, CITIES, BARANGAYS, COUNTRY } from '@/lib/constants/locations'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProfileFormProps {
    profile: ProfileWithUser
    isEditing: boolean
    isLoading: boolean
    onEditingChangeAction: (editing: boolean) => void
}

export function ProfileForm({ profile, isEditing, isLoading, onEditingChangeAction }: ProfileFormProps) {
    const { update } = useSession()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: profile?.user?.username ?? '',
            name: profile?.user?.name ?? '',
            email: profile?.user?.email ?? '',
            dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
            phoneNumber: profile?.phoneNumber ?? '',
            address: profile?.address ?? '',
            city: profile?.city ?? '',
            state: profile?.state ?? '',
            country: profile?.country ?? COUNTRY,
            postalCode: profile?.postalCode ?? '',
            bio: profile?.bio ?? '',
            occupation: profile?.occupation ?? '',
            gender: (profile?.gender as 'male' | 'female' | 'other') ?? undefined,
            nationality: profile?.nationality ?? '',
        },
    })

    const [provinceSuggestions, setProvinceSuggestions] = useState<Province[]>([])
    const [citySuggestions, setCitySuggestions] = useState<City[]>([])
    const [barangaySuggestions, setBarangaySuggestions] = useState<Barangay[]>([])
    const [occupationSuggestions, setOccupationSuggestions] = useState<string[]>([])

    type AddressField = 'state' | 'city' | 'address'


    const handleOccupationChange = (value: string) => {
        const filteredOccupations = OCCUPATIONS.filter(occupation =>
            occupation.toLowerCase().includes(value.toLowerCase())
        )
        setOccupationSuggestions(filteredOccupations)
    }

    const handleOccupationSuggestionClick = (value: string) => {
        form.setValue('occupation', value)
        setOccupationSuggestions([])
    }

    const handleInputChange = (value: string, type: AddressField) => {
        if (type === 'state') {
            const filteredProvinces = PROVINCES.filter(province =>
                province.name.toLowerCase().includes(value.toLowerCase())
            )
            setProvinceSuggestions(filteredProvinces)
        } else if (type === 'city') {
            const selectedProvince = form.watch('state')
            const filteredCities = CITIES.filter(city =>
                city.name.toLowerCase().includes(value.toLowerCase()) &&
                (!selectedProvince || city.province === selectedProvince)
            )
            setCitySuggestions(filteredCities)
        } else if (type === 'address') {
            const selectedCity = form.watch('city')
            const filteredBarangays = BARANGAYS.filter(barangay =>
                barangay.name.toLowerCase().includes(value.toLowerCase()) &&
                (!selectedCity || barangay.city === selectedCity)
            )
            setBarangaySuggestions(filteredBarangays)
        }
    }

    const handleSuggestionClick = (value: string, type: AddressField) => {
        form.setValue(type, value)
        if (type === 'state') setProvinceSuggestions([])
        if (type === 'city') setCitySuggestions([])
        if (type === 'address') setBarangaySuggestions([])
    }

    async function onSubmit(data: ProfileFormValues) {
        if (!isEditing) return
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    image: profile?.user?.image,
                }),
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error)
            }

            await update(result.data.user)
            toast.success('Profile updated successfully')
            onEditingChangeAction(false)
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-10 w-full" />
                ))}
                <div className="flex justify-start gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">

                    {/* Personal Information Section */}
                    <div className="p-6 shadow rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!isEditing || isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!isEditing || isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email (Disabled) */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date of Birth */}
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={!isEditing || isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone Number */}
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={!isEditing || isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Gender */}
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ''}
                                            disabled={!isEditing || isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="p-6 shadow rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Address Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Province (Autocomplete) */}
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel>Province</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={!isEditing || isSubmitting}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleInputChange(e.target.value, 'state')
                                                }}
                                                placeholder="Type your province"
                                            />
                                        </FormControl>
                                        {provinceSuggestions.length > 0 && (
                                            <div className="absolute z-10 bg-white border rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                                                {provinceSuggestions.map((province) => (
                                                    <div
                                                        key={`${province.name}-${province.region}`}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleSuggestionClick(province.name, 'state')}
                                                    >
                                                        {province.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* City/Municipality (Autocomplete) */}
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel>City/Municipality</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={!isEditing || isSubmitting}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleInputChange(e.target.value, 'city')
                                                }}
                                                placeholder="Type your city or municipality"
                                            />
                                        </FormControl>
                                        {citySuggestions.length > 0 && (
                                            <div className="absolute z-10 bg-white border rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                                                {citySuggestions.map((city) => (
                                                    <div
                                                        key={`${city.name}-${city.province ?? ''}`}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleSuggestionClick(city.name, 'city')}
                                                    >
                                                        {city.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Barangay (Autocomplete) */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel>Barangay</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={!isEditing || isSubmitting}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleInputChange(e.target.value, 'address')
                                                }}
                                                placeholder="Type your barangay"
                                            />
                                        </FormControl>
                                        {barangaySuggestions.length > 0 && (
                                            <div className="absolute z-10 bg-white border rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                                                {barangaySuggestions.map((barangay) => (
                                                    <div
                                                        key={`${barangay.name}-${barangay.city ?? ''}-${barangay.municipality ?? ''}`}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleSuggestionClick(barangay.name, 'address')}
                                                    >
                                                        {barangay.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Postal Code */}
                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={!isEditing || isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Country */}
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Input {...field} value={COUNTRY} disabled />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Professional Information Section */}
                    <div className="p-6 shadow rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Occupation */}
                            <FormField
                                control={form.control}
                                name="occupation"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel>Occupation</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={!isEditing || isSubmitting}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleOccupationChange(e.target.value)
                                                }}
                                                placeholder="Type your occupation"
                                            />
                                        </FormControl>
                                        {occupationSuggestions.length > 0 && (
                                            <div className="absolute z-10 bg-white border rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                                                {occupationSuggestions.map((occupation, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleOccupationSuggestionClick(occupation)}
                                                    >
                                                        {occupation}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Nationality */}
                            <FormField
                                control={form.control}
                                name="nationality"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nationality</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={!isEditing || isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="p-6 shadow rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Bio</h2>
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ''}
                                            disabled={!isEditing || isSubmitting}
                                            className="h-32"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Buttons */}
                    {isEditing && (
                        <div className="flex justify-start gap-4">
                            <Button variant="outline" onClick={() => onEditingChangeAction(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </div>
            </form>
        </Form>
    )
}
