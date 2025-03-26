import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as DropdownMenu from 'zeego/dropdown-menu'
import RoundButton from './RoundButton'
const DropDown = () => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <RoundButton icon={'ellipsis-horizontal'} title={'More'} />
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                <DropdownMenu.Item key='statement'>
                    <DropdownMenu.ItemTitle>Statement</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon ios={{
                        name: 'list.bullet.rectangle.fill', pointSize: 24
                    }} androidIconName='list' />

                </DropdownMenu.Item>
                <DropdownMenu.Item key='converter'>
                    <DropdownMenu.ItemTitle>Converter</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon ios={{
                        name: 'coloncurrencysign.arrow.circlepath', pointSize: 24
                    }} androidIconName='swap-horizontal' />

                </DropdownMenu.Item>
                <DropdownMenu.Item key='background'>
                    <DropdownMenu.ItemTitle>Background</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon ios={{
                        name: 'photo.fill', pointSize: 24
                    }} androidIconName='photo' />

                </DropdownMenu.Item>

                <DropdownMenu.Item key='account'>
                    <DropdownMenu.ItemTitle>Add new account</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon ios={{
                        name: 'plus.rectangle.on.folder.fill', pointSize: 24
                    }} androidIconName='add-circle' />

                </DropdownMenu.Item>

            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default DropDown

const styles = StyleSheet.create({})