import type { NextPage } from 'next'
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { toast } from 'react-toastify';

import styles from '../../styles/Home.module.css'

// containers
import LayoutWithAuth from '../../containers/LayoutWithAuth';

// components
import Button from '../../components/Button';
import { Loading } from "../../components/Loading";
import { Tag } from "../../components/Tag";
import Modal from "../../components/Modal";

// queries
import { TeamQueries, TeamMutations } from "../../queries/team.queries";

// types
import { Account } from '../../types/account.type';
import { TeamInvitation } from '../../types/team.type';

interface GetTeamResponse{
    team: Account[];
    invitations: TeamInvitation[];
}

const Team: NextPage = () => {
    const tabs = ["Accounts", "Invitations"];
    const router = useRouter();

    const [ deleteInviteId, setDeleteInviteId ] = useState<number | null>(null);

    const { data, loading, refetch } = useQuery<GetTeamResponse>(TeamQueries.getTeam);
    const [ deleteInvite, { loading: deleteInviteLoading } ] = useMutation(TeamMutations.deleteInvite);
    const [ resendInvite, { loading: resendInviteLoading } ] = useMutation(TeamMutations.resendInvite);

    if (loading || !data) return <Loading />;

    const columnClassname = `px-2 py-2`;
    const rowOddClassName = `bg-grey-100`;
    const rowEvenClassName = `bg-slate-50`;

    return (
        <div className={styles.container} style={{ width: "100%" }}>
            <div className="py-2">
                <div className="flex justify-between">
                    <h2 className="font-bold text-2xl">Team</h2>
                    <Button onMouseDown={() => {
                        router.push("/team/invite");
                    }} type="primary">Invite Member</Button>
                </div>
                <div className="pt-4">
                    <Tab.Group>
                        <Tab.List className="flex gap-6">
                            {tabs.map((tab, i) => (
                                <Tab className="text-lg font-semibold -mx-2" key={i}>
                                    {({ selected }) => (
                                        <div className={`px-2 pb-1 box-content border-b-4 ${selected ? "border-b-primary-color text-primary-color" : "border-b-transparent"}`}>{tab}</div>
                                    )}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel>
                                <table className="table-fixed w-full my-6">
                                    <thead className="text-left align-top">
                                        <tr className="box-border bg-slate-200">
                                            <th className={`text-lg ${columnClassname}`}>Member</th>
                                            <th className={`text-lg ${columnClassname}`}>User Roles</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.team.map((member, i) => (
                                            <tr className={`text-left align-top py-2 box-border ${i % 2 === 0 ? rowOddClassName : rowEvenClassName}`} key={i}>
                                                <td className={`${columnClassname}`}>
                                                    <h6>{member.firstName} {member.lastName}</h6>
                                                    <p>{member.email}</p>
                                                </td>
                                                <td className={`${columnClassname}`}>
                                                    {member.userRoleDefs.map((role, j) => (
                                                        <Tag type="primary" key={j}>{role.label}</Tag>
                                                    ))}
                                                </td>
                                                <td className={`${columnClassname}`}>
                                                    <Button type="danger" onMouseDown={() => {}}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Tab.Panel>
                            <Tab.Panel>
                                <table className="table-fixed w-full my-6">
                                    <thead className="text-left align-top">
                                        <tr className="py-2 box-border bg-slate-200">
                                            <th className={`text-lg ${columnClassname}`}>Member</th>
                                            <th className={`text-lg ${columnClassname}`}>User Roles</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.invitations.map((invite, i) => (
                                            <tr className={`text-left align-top py-2 box-border ${i % 2 === 0 ? rowOddClassName : rowEvenClassName}`} key={i}>
                                                <td className={`${columnClassname}`}>
                                                    <h6>{invite.firstName} {invite.lastName}</h6>
                                                    <p>{invite.email}</p>
                                                </td>
                                                <td className={`${columnClassname}`}>
                                                    {invite.userRoleDefs.map((role, j) => (
                                                        <Tag type="primary" key={j}>{role.label}</Tag>
                                                    ))}
                                                </td>
                                                <td className={`flex ${columnClassname} gap-1`}>
                                                    <Button
                                                        type="default"
                                                        loading={resendInviteLoading}
                                                        onMouseDown={async () => {
                                                            try {
                                                                await resendInvite({
                                                                    variables: {
                                                                        data: {
                                                                            id: invite.id
                                                                        }
                                                                    }
                                                                });
                                                                refetch();
                                                            } catch(e) {
                                                                let parsedErrors = (e as ApolloError).graphQLErrors;
                                                                const messages = parsedErrors.map((err) => err.message);
                                
                                                                for (let message of messages) {
                                                                    toast.error(message);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Resend
                                                    </Button>
                                                    <Button type="danger" onMouseDown={() => {
                                                        setDeleteInviteId(invite.id);
                                                    }}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
            {deleteInviteId ? (
                <Modal
                    title="Delete Invite"
                    open={deleteInviteId ? true : false}
                    onClose={() => {
                        setDeleteInviteId(null);
                    }}
                >
                    <div className="py-2">
                        <p>Are you sure you want to delete this invite?</p>
                    </div>
                    <div className="flex py-2 gap-1">
                        <Button type="danger" onMouseDown={async () => {
                            try {
                                await deleteInvite({
                                    variables: {
                                        data: {
                                            id: deleteInviteId
                                        }
                                    }
                                });
                                setDeleteInviteId(null);
                                refetch();
                            } catch(e) {
                                let parsedErrors = (e as ApolloError).graphQLErrors;
                                const messages = parsedErrors.map((err) => err.message);

                                for (let message of messages) {
                                    toast.error(message);
                                }
                            }
                        }}>Yes</Button>
                        <Button type="default" onMouseDown={() => {
                            setDeleteInviteId(null);
                        }}>No</Button>
                    </div>
                </Modal>
            ) : null}
        </div>
    )
}

const TeamPage = () => (
    <LayoutWithAuth>
        <Team />
    </LayoutWithAuth>
)

export default TeamPage;
