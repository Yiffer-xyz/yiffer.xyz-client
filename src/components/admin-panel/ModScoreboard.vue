<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Mod scoreboard</h2>
    <span class="admin-content-box-inner" v-if="isOpen">
			<p>
				This is a little thing intended to motivate the mods, or reward those who
				participate a lot. No hard feelings / no shame if you're not high up, that's
				not what this is for :)
			</p>

			<table class="y-table">
				<thead>
					<tr>
						<th>Mod name</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in modScoreList" :key="row.name">
						<td>{{row.name}}</td>
						<td>{{row.score}}</td>
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
			modScoreList: []
    }
  },

  methods: {
    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
	},
	
	async created () {
		this.modScoreList = (await miscApi.getModScores()).result
			.sort((a, b) => a.score<b.score ? 1 : -1)
	}
}
</script>