<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Mod scoreboard</h2>
    <span class="admin-content-box-inner" v-if="isOpen">
			<table class="y-table">
				<thead>
					<tr>
						<th>Mod name</th>
						<th>Action</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in modLog" :key="row.modName">
						<td>{{row.modName}}</td>
						<td>{{row.action}}</td>
						<td>{{row.date}}</td>
					</tr>
				</tbody>
			</table>

      <menu-up-icon @click.native="closeComponent" class="mdi-arrow close-component-arrow"/>
    </span>

    <span v-else>
      <menu-down-icon class="mdi-arrow"/>
    </span>
  </div>
</template>

<script>
import miscApi from '../../api/miscApi'

export default {
  name: 'modScoreboard',

  data: function () {
    return {
			isOpen: false,
			modLog: []
    }
  },

  methods: {
    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
	},
	
	async created () {
		this.modLog = (await miscApi.getModLog()).result
	}
}
</script>