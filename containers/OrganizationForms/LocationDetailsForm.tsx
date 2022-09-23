import { FunctionComponent, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/solid";
import { useFormik } from "formik";
import { gql, useMutation, useQuery, ApolloError } from "@apollo/client";
import { toast } from "react-toastify";

// components
import { FormItem } from "../../components/Form";
import Button from "../../components/Button";
import LocationSearchInput from "../../components/LocationSearchInput";

// types
import { Location } from "../../types/location.type";
import { Loading } from "../../components/Loading";

const Queries = {
    GET_ORGANIZATION_LOCATION_DETAILS: gql`
        query Organization{
            me{
                organization{
                    id
                    locations{
                        placeId
                        formattedAddress
                        district
                        province
                        geo{
                            lat
                            lon
                        }
                    }
                }
            }
        }
    `,
    UPDATE_ORGANIZATION_LOCATION_DETAILS: gql`
        mutation UpdateLocationDetails($data: LocationUpdateInput!){
            updateLocationDetails(data: $data)
        }
    `,
}

interface LocationUpdatePayload{
    locations: Location[];
}

const LocationDetailsForm: FunctionComponent = () => {
    const { data, loading, refetch } = useQuery(Queries.GET_ORGANIZATION_LOCATION_DETAILS);
    const [ updateLocationDetails, { loading: submitting } ] = useMutation(Queries.UPDATE_ORGANIZATION_LOCATION_DETAILS);

    const initialValues = {
        locations: [],
    } as LocationUpdatePayload;

    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            try {
                await updateLocationDetails({ 
                    variables: { 
                        data: {
                            payload: values.locations.map((location) => ({
                                placeId: location.placeId,
                                formattedAddress: location.formattedAddress,
                                district: location.district,
                                province: location.province,
                                geo: {
                                    lat: location.geo.lat,
                                    lon: location.geo.lon,
                                }
                            })),
                        }
                    },
                });
                refetch();
            } catch(e) {
                let parsedErrors = (e as ApolloError).graphQLErrors;
                const messages = parsedErrors.map((err) => err.message);
                
                for (let message of messages) {
                    toast.error(message);
                }
            }
        }
    });

    useEffect(() => {
        if (data?.me?.organization) {
            formik.setValues({
                locations: data?.me?.organization?.locations ?? [],
            });
        }
    }, [ data ]);

    const { values } = formik;

    if (loading) return <Loading />;

    return (
        <div>
            <FormItem label="Locations">
                <div className="flex-col w-full">
                <div className="flex flex-col">
                    <ul className="list-disc list-inside leading-7">
                        {values.locations.map((location, i) => (
                            <li key={i}>
                                <span className="inline-flex items-center">
                                    <a href="">{location.formattedAddress}</a>
                                    <a 
                                        href="" 
                                        className="text-red-500 inline-block ml-2"
                                        onMouseDown={() => {
                                            const newLocations = values.locations.filter((_, index) => index !== i);
                                            formik.setFieldValue("locations", newLocations);
                                        }}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </a>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full flex gap-1 mt-4">
                    <LocationSearchInput 
                        onSelect={(location) => {
                            formik.setFieldValue("locations", [...values.locations, location]);
                        }}
                    />
                </div>
                </div>
            </FormItem>
            <div>
                <Button 
                    type="primary" 
                    actionType="submit"
                    onMouseDown={() => {
                        formik.submitForm();
                    }}
                    loading={submitting}
                >Update</Button>
            </div>
        </div>
    )
}

export default LocationDetailsForm;